const nodemailer = require('nodemailer');

const stripWrappingQuotes = (value = '') => value.trim().replace(/^(["'])(.*)\1$/, '$2');
const emailUser = stripWrappingQuotes(process.env.EMAIL_USER);
// Gmail displays App Passwords in groups of four characters. Spaces pasted
// from that display are not part of the credential.
const emailPass = stripWrappingQuotes(process.env.EMAIL_PASS).replace(/\s/g, '');
const smtpSecure = stripWrappingQuotes(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
const brevoApiKey = stripWrappingQuotes(process.env.BREVO_API_KEY);
const emailFrom = stripWrappingQuotes(process.env.EMAIL_FROM || (emailUser ? `AI Resume Analyzer <${emailUser}>` : ''));

const isEmailConfigured = () => Boolean(brevoApiKey || resendApiKey || (emailUser && emailPass));

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

const parseSender = () => {
  const match = /^(.+?)\s*<([^>]+)>$/.exec(emailFrom);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: 'ResumeAI', email: emailFrom };
};

const sendViaBrevo = async (email, otp) => {
  const sender = parseSender();
  const { subject, html } = getOTPEmail(otp);
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': brevoApiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: sender.name || 'ResumeAI', email: sender.email || emailFrom },
      to: [{ email }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo rejected the email (${response.status}): ${details}`);
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
    const error = new Error('Email delivery is not configured. Set BREVO_API_KEY and EMAIL_FROM.');
    error.statusCode = 503;
    throw error;
  }

  try {
    // Use Brevo if available (free, no domain needed)
    // Otherwise fall back to SMTP (Gmail)
    if (brevoApiKey) await sendViaBrevo(email, otp);
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
