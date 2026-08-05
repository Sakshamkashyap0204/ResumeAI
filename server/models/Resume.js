const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  extractedText: { type: String },
  extractedSkills: [{ type: String }],
  projects: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
