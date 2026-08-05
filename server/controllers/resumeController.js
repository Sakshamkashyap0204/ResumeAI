const path = require('path');
const Resume = require('../models/Resume');
const { extractTextFromPDF } = require('../services/pdfService');

exports.uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const filePath = path.resolve(req.file.path);
  const extractedText = await extractTextFromPDF(filePath);

  console.log('Extracted text length:', extractedText?.length);
  console.log('Extracted text preview:', extractedText?.slice(0, 300));

  if (!extractedText || extractedText.length < 50)
    return res.status(400).json({ message: 'Could not extract text from PDF. Make sure it is not a scanned image.' });

  const resume = await Resume.create({
    userId: req.user.id,
    fileName: req.file.originalname,
    fileUrl: req.file.path,
    extractedText,
  });

  res.status(201).json({ message: 'Resume uploaded', resumeId: resume._id, extractedText });
};

exports.getUserResumes = async (req, res) => {
  const resumes = await Resume.find({ userId: req.user.id }).select('-extractedText').sort('-createdAt');
  res.json(resumes);
};
