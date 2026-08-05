const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  jobTitle:        { type: String },
  jobDescription:  { type: String },
  experienceLevel: { type: String },
  matchPercentage: { type: Number, min: 0, max: 100 },
  matchedSkills:   [{ type: String }],
  missingSkills:   [{ type: String }],
  skills:          [{ type: String }],
  projects:        [{ type: String }],
  strongPoints:    [{ type: String }],
  weakPoints:      [{ type: String }],
  resumeSuggestions: [{ type: String }],
  roadmap:         { type: String, set: (v) => Array.isArray(v) ? v.join('\n') : String(v || '') },
}, { timestamps: true });

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);
