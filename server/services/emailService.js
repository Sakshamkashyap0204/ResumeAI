const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"AI Resume Analyzer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Verification Code',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px">
        <h2 style="color:#4f46e5">Verify Your Email</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing:8px;color:#4f46e5">${otp}</h1>
        <p style="color:#6b7280;font-size:14px">Expires in 5 minutes. Do not share this code.</p>
      </div>
    `,
  });
};

module.exports = { generateOTP, sendOTPEmail };
