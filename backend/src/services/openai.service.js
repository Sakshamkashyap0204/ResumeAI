'use strict';

const Groq = require('groq-sdk');
const env = require('../config/env');
const AppError = require('../utils/AppError');

const SYSTEM_PROMPTS = {
  story: `You are a masterful storyteller. Write vivid, engaging stories with strong narrative arcs,
compelling characters, and immersive descriptions. Adapt your style to the requested genre and tone.
Return only the story content — no titles, no preamble, no meta-commentary.`,

  poem: `You are a skilled poet with deep knowledge of poetic forms, meter, and imagery.
Write emotionally resonant poetry that uses precise language and evocative imagery.
Adapt your style to the requested form and tone. Return only the poem — no titles, no explanations.`,

  joke: `You are a sharp, witty comedian. Write clever, original jokes that are genuinely funny.
Avoid offensive content. Match the requested style (pun, one-liner, observational, etc.).
Return only the joke — no setup labels, no explanations.`,
};

const LENGTH_TOKENS = {
  short: 300,
  medium: 600,
  long: 1200,
};

class GroqService {
  constructor() {
    this.client = new Groq({ apiKey: env.groq.apiKey });
    this.model = env.groq.model;
  }

  _buildUserPrompt(type, prompt, parameters) {
    const parts = [`Write a ${type}`];
    if (parameters.genre) parts.push(`in the ${parameters.genre} genre`);
    if (parameters.tone) parts.push(`with a ${parameters.tone} tone`);
    if (parameters.style) parts.push(`in the style of ${parameters.style}`);
    if (parameters.length) parts.push(`(${parameters.length} length)`);
    parts.push(`about: ${prompt}`);
    return parts.join(' ');
  }

  async generate(type, prompt, parameters = {}) {
    const systemPrompt = SYSTEM_PROMPTS[type];
    if (!systemPrompt) {
      throw new AppError(`Unsupported content type: ${type}`, 400);
    }

    const userPrompt = this._buildUserPrompt(type, prompt, parameters);
    const maxTokens = LENGTH_TOKENS[parameters.length] || LENGTH_TOKENS.medium;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.85,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new AppError('AI returned an empty response', 502);
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
}

module.exports = new GroqService();
