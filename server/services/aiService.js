const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analyzeResume = async (resumeText, jobDescription, requiredSkills = [], experienceLevel = 'fresher') => {
  if (!resumeText || resumeText.trim().length < 50)
    throw new Error('Resume text is too short or empty. Make sure your PDF is not a scanned image.');

  const requiredSkillsList = requiredSkills.length > 0
    ? `REQUIRED SKILLS FOR THIS ROLE:\n${requiredSkills.join(', ')}`
    : '';

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are a strict, honest resume reviewer. Read the resume text word by word. 
Only extract what is EXPLICITLY written. Never invent skills or experience. Return valid JSON only.`,
      },
      {
        role: 'user',
        content: `Analyze this resume for a candidate applying as: ${jobDescription.split('\n')[0]}
Experience level: ${experienceLevel}

=== RESUME TEXT ===
${resumeText}

=== JOB REQUIREMENTS ===
${jobDescription}

${requiredSkillsList}

Return ONLY this JSON (no markdown, no extra text):
{
  "skills": [],
  "projects": [],
  "matchPercentage": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strongPoints": [],
  "weakPoints": [],
  "resumeSuggestions": [],
  "roadmap": ""
}

Rules for each field:
- skills: ALL technical skills, tools, languages, frameworks found in the resume text
- projects: project names/titles found in the resume
- matchedSkills: skills from REQUIRED SKILLS that exist in the resume
- missingSkills: skills from REQUIRED SKILLS that are NOT in the resume
- matchPercentage: (matchedSkills.length / requiredSkills.length * 100), rounded integer
- strongPoints: 3-5 genuine strengths found in this resume for this role (e.g. "Strong React experience with 3 projects", "Has REST API integration experience")
- weakPoints: 3-5 honest weaknesses or gaps (e.g. "No testing experience mentioned", "Missing backend skills for this role", "No internship or work experience listed")
- resumeSuggestions: 4-6 specific actionable things to ADD or IMPROVE in the resume itself (e.g. "Add a personal projects section with GitHub links", "Include an internship or freelance experience section", "Add measurable achievements like 'improved load time by 40%'", "Add a certifications section", "Include a professional summary at the top")
- roadmap: numbered steps (one per line) to learn the missingSkills, tailored for ${experienceLevel} level`,
      },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });

  const parsed = JSON.parse(completion.choices[0].message.content.trim());

  // Normalize roadmap
  if (Array.isArray(parsed.roadmap)) {
    parsed.roadmap = parsed.roadmap.join('\n');
  } else if (typeof parsed.roadmap !== 'string') {
    parsed.roadmap = String(parsed.roadmap || '');
  }

  // Normalize array fields
  ['strongPoints', 'weakPoints', 'resumeSuggestions'].forEach(field => {
    if (!Array.isArray(parsed[field])) parsed[field] = [];
  });

  // Server-side recalculation of match — AI cannot override this
  if (requiredSkills.length > 0) {
    const resumeText_lower = resumeText.toLowerCase();
    const resumeSkillsLower = (parsed.skills || []).map(s => s.toLowerCase().trim());

    const skillMatch = (req) => {
      const r = req.toLowerCase().trim();
      // 1. Exact match in extracted skills list
      if (resumeSkillsLower.includes(r)) return true;
      // 2. Word-boundary match in extracted skills (e.g. "Node.js" matches "node.js")
      if (resumeSkillsLower.some(rs => rs === r)) return true;
      // 3. Word-boundary match in raw resume text (handles aliases)
      const escaped = r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, 'i');
      return regex.test(resumeText_lower);
    };

    const matched = requiredSkills.filter(skillMatch);
    const missing = requiredSkills.filter(req => !skillMatch(req));

    parsed.matchedSkills   = matched;
    parsed.missingSkills   = missing;
    parsed.matchPercentage = Math.round((matched.length / requiredSkills.length) * 100);
  }

  return parsed;
};

module.exports = { analyzeResume };
