const nodemailer = require('nodemailer');

const stripWrappingQuotes = (value = '') => value.trim().replace(/^(["'])(.*)\1$/, '$2');
const emailUser = stripWrappingQuotes(process.env.EMAIL_USER);
// Gmail displays App Passwords in groups of four characters. Spaces pasted
// from that display are not part of the credential.
const emailPass = stripWrappingQuotes(process.env.EMAIL_PASS).replace(/\s/g, '');
const smtpSecure = stripWrappingQuotes(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
const resendApiKey = stripWrappingQuotes(process.env.RESEND_API_KEY);
const emailFrom = stripWrappingQuotes(process.env.EMAIL_FROM || (emailUser ? `AI Resume Analyzer <${emailUser}>` : ''));

const isEmailConfigured = () => Boolean(resendApiKey || (emailUser && emailPass));

const transporter = nodemailer.createTransport({
  host: stripWrappingQuotes(process.env.SMTP_HOST || 'smtp.gmail.com'),
  port: Number(stripWrappingQuotes(process.env.SMTP_PORT || '587')),
  secure: smtpSecure,
  auth: { user: emailUser, pass: emailPass },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const getOTPEmail = (otp) => ({
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

const sendViaResend = async (email, otp) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: emailFrom, to: [email], ...getOTPEmail(otp) }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend rejected the email (${response.status}): ${details}`);
  }
};

const sendViaSmtp = async (email, otp) => {
  const { subject, html } = getOTPEmail(otp);
  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject,
    html,
  });
};

const sendOTPEmail = async (email, otp) => {
  if (!isEmailConfigured()) {
    const error = new Error('Email delivery is not configured. Set RESEND_API_KEY and EMAIL_FROM.');
    error.statusCode = 503;
    throw error;
  }

  try {
    if (resendApiKey) await sendViaResend(email, otp);
    else await sendViaSmtp(email, otp);
  } catch (cause) {
    console.error('OTP email delivery failed:', {
      message: cause.message,
      code: cause.code,
      responseCode: cause.responseCode,
      command: cause.command,
    });
    const error = new Error('We could not send the verification email. Please try again shortly.');
    error.statusCode = 503;
    throw error;
  }
};

module.exports = { generateOTP, sendOTPEmail, isEmailConfigured };
