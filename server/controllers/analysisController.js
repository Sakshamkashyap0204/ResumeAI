const Resume = require('../models/Resume');
const AnalysisResult = require('../models/AnalysisResult');
const { analyzeResume } = require('../services/aiService');

exports.analyzeResume = async (req, res) => {
  const { resumeId, jobDescription, jobTitle, requiredSkills, experienceLevel } = req.body;
  if (!resumeId || !jobDescription)
    return res.status(400).json({ message: 'resumeId and jobDescription are required' });

  const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
  if (!resume) return res.status(404).json({ message: 'Resume not found' });

  const aiResult = await analyzeResume(
    resume.extractedText,
    jobDescription,
    requiredSkills || [],
    experienceLevel || 'fresher'
  );

  resume.extractedSkills = aiResult.skills;
  resume.projects = aiResult.projects;
  await resume.save();

  const result = await AnalysisResult.create({
    userId: req.user.id,
    resumeId,
    jobTitle: jobTitle || 'Untitled',
    jobDescription,
    experienceLevel: experienceLevel || 'fresher',
    matchPercentage: aiResult.matchPercentage,
    matchedSkills: aiResult.matchedSkills,
    missingSkills: aiResult.missingSkills,
    roadmap: aiResult.roadmap,
    skills: aiResult.skills,
    projects: aiResult.projects,
    strongPoints: aiResult.strongPoints || [],
    weakPoints: aiResult.weakPoints || [],
    resumeSuggestions: aiResult.resumeSuggestions || [],
  });

  res.status(201).json(result);
};

exports.getResult = async (req, res) => {
  const result = await AnalysisResult.findOne({ _id: req.params.id, userId: req.user.id })
    .populate('resumeId', 'fileName');
  if (!result) return res.status(404).json({ message: 'Result not found' });
  res.json(result);
};

exports.getUserResults = async (req, res) => {
  const results = await AnalysisResult.find({ userId: req.user.id })
    .populate('resumeId', 'fileName')
    .sort('-createdAt');
  res.json(results);
};

exports.deleteResult = async (req, res) => {
  const result = await AnalysisResult.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!result) return res.status(404).json({ message: 'Result not found' });
  res.json({ message: 'Deleted successfully' });
};
