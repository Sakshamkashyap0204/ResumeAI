'use strict';

const Groq = require('groq-sdk');
const OpenAI = require('openai');
const env = require('../config/env');
const AppError = require('../utils/AppError');

const SYSTEM_PROMPTS = {
  story: `You are a masterful storyteller. Write a complete, finished story with vivid, engaging stories with strong narrative arcs,
compelling characters, and immersive descriptions. Adapt your style to the requested genre and tone.
Include a clear beginning, development, climax, and satisfying resolution. Return only the story content — no titles, no preamble, no meta-commentary. Never stop mid-sentence or leave the ending unresolved.`,

  poem: `You are a skilled poet. Write a complete, finished poem with deep knowledge of poetic forms, meter, and imagery.
Write emotionally resonant poetry that uses precise language and evocative imagery.
Adapt your style to the requested form and tone, and end with a deliberate final line. Return only the poem — no titles, no explanations. Never stop mid-stanza.`,

  joke: `You are a sharp, witty comedian. Write a complete joke with a clear setup and punchline that is clever and original.
Avoid offensive content. Match the requested style (pun, one-liner, observational, etc.).
Return only the joke — no setup labels, no explanations. Never return only a setup without a punchline.`,
};

const INTERPRETATION_INSTRUCTION = 'Interpret misspellings, typos, shorthand, and closely related words by meaning and context. When the intended request is clear, silently use the most likely meaning rather than refusing or focusing on the spelling.';

const LENGTH_TOKENS = {
  short: 700,
  medium: 1200,
  long: 2000,
};

const LENGTH_INSTRUCTIONS = {
  short: 'Keep it concise: approximately 250-400 words for a story, 8-16 lines for a poem, or one complete joke.',
  medium: 'Use a moderate, complete length: approximately 500-750 words for a story, 16-28 lines for a poem, or a developed joke with setup and punchline.',
  long: 'Make it substantially developed: approximately 900-1300 words for a story, 28-45 lines for a poem, or a multi-beat joke with a complete punchline.',
};

class GroqService {
  constructor() {
    this.client = new Groq({ apiKey: env.groq.apiKey });
    this.model = env.groq.model;
    this.visionClient = env.vision.apiKey ? new OpenAI({ apiKey: env.vision.apiKey }) : null;
  }

  _buildUserPrompt(type, prompt, parameters) {
    const length = parameters.length || 'medium';
    const parts = [
      `Create exactly one complete ${type}.`,
      `The user's creative request is: ${prompt}`,
      `Length requirement: ${length}. ${LENGTH_INSTRUCTIONS[length]}`,
      'Treat the length, genre, and tone requirements as strict constraints, not suggestions.',
      INTERPRETATION_INSTRUCTION,
    ];
    if (parameters.genre) parts.push(`Genre requirement: ${parameters.genre}. Use recognizable genre conventions throughout.`);
    if (parameters.tone) parts.push(`Tone requirement: ${parameters.tone}. Maintain this emotional tone from beginning to end.`);
    if (parameters.style) parts.push(`Style requirement: ${parameters.style}.`);
    parts.push('Return only the finished creative work. Do not explain your choices or mention these instructions.');
    return parts.join('\n');
  }

  async generate(type, prompt, parameters = {}, attachments = [], conversationContext = [], memories = []) {
    const systemPrompt = SYSTEM_PROMPTS[type];
    if (!systemPrompt) {
      throw new AppError(`Unsupported content type: ${type}`, 400);
    }

    const imageAttachments = attachments.filter((attachment) => attachment.kind === 'image');
    if (imageAttachments.length && !this.visionClient) {
      throw new AppError('Image generation requires OPENAI_VISION_API_KEY to be configured.', 422);
    }
    const attachmentContext = attachments
      .filter((attachment) => attachment.kind === 'text')
      .map((attachment) => `\nAttachment: ${attachment.filename}\n${attachment.extractedText}`)
      .join('\n');
    const conversationText = conversationContext.length
      ? `\nUse this conversation as creative context, while following the current request as the source of truth:\n${conversationContext.map(({ role, content }) => `${role}: ${content}`).join('\n')}`
      : '';
    const memoryText = memories.length
      ? `\nRelevant user preferences and facts:\n${memories.map((memory) => `- ${memory.content}`).join('\n')}`
      : '';
    const userPrompt = `${this._buildUserPrompt(type, prompt, parameters)}${conversationText}${memoryText}${attachmentContext ? `\nUse the following attachment text as source context:\n${attachmentContext}` : ''}`;
    const messages = [{ role: 'user', content: [
      { type: 'text', text: userPrompt },
      ...imageAttachments.map((attachment) => ({
        type: 'image_url',
        image_url: { url: attachment.imageData },
      })),
    ] }];
    const maxTokens = LENGTH_TOKENS[parameters.length] || LENGTH_TOKENS.medium;

    try {
      const response = imageAttachments.length
        ? await this.visionClient.chat.completions.create({
          model: env.vision.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          max_tokens: maxTokens,
          temperature: 0.85,
        })
        : await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.85,
      });

      let content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new AppError('AI returned an empty response', 502);
      }

      if (response.choices[0]?.finish_reason === 'length') {
        const continuation = imageAttachments.length
          ? await this.visionClient.chat.completions.create({
            model: env.vision.model,
            messages: [{ role: 'system', content: 'Continue the creative work from the exact stopping point. Do not repeat text. Finish it with a proper ending and return only the continuation.' }, { role: 'user', content }],
            max_tokens: 500,
            temperature: 0.75,
          })
          : await this.client.chat.completions.create({
            model: this.model,
            messages: [{ role: 'system', content: 'Continue the creative work from the exact stopping point. Do not repeat text. Finish it with a proper ending and return only the continuation.' }, { role: 'user', content }],
            max_tokens: 500,
            temperature: 0.75,
          });
        const continuationText = continuation.choices[0]?.message?.content?.trim();
        if (continuationText) content = `${content}\n${continuationText}`;
      }

      return {
        content,
        tokensUsed: response.usage?.total_tokens || 0,
        model: response.model,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      if (error.status === 429) {
        throw new AppError('AI rate limit reached. Please try again shortly.', 429);
      }
      if (error.status === 401) {
        throw new AppError('AI service authentication failed.', 502);
      }

      throw new AppError('AI generation failed. Please try again.', 502);
    }
  }

  async chat(messages) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are Muse, a thoughtful and creative assistant. Be helpful, clear, and concise.
Interpret the user's meaning rather than matching words literally. Correctly understand common spelling mistakes, typos, missing letters, punctuation errors, abbreviations, shorthand, and phonetic spellings. Use the surrounding sentence and conversation to infer intent, and connect words or phrases that are closely related in meaning.
If the intended meaning is reasonably clear, answer naturally without interrupting to correct the user. If two interpretations are genuinely possible, briefly ask for clarification. Never invent a correction when the user's wording is already understandable.`,
          },
          ...messages,
        ],
        max_tokens: 800,
        temperature: 0.8,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) throw new AppError('AI returned an empty response', 502);
      return { content, tokensUsed: response.usage?.total_tokens || 0, model: response.model };
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error.status === 429) throw new AppError('AI rate limit reached. Please try again shortly.', 429);
      if (error.status === 401) throw new AppError('AI service authentication failed.', 502);
      throw new AppError('AI chat failed. Please try again.', 502);
    }
  }
}

module.exports = new GroqService();
