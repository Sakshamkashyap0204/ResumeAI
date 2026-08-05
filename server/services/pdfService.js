const pdfParse = require('pdf-parse');
const fs = require('fs');

const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  const cleanText = data.text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')       // collapse horizontal whitespace only
    .replace(/\n{3,}/g, '\n\n')    // max 2 consecutive newlines
    .trim();

  return cleanText;
};

module.exports = { extractTextFromPDF };
