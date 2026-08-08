const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../services/emailService');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const requireSignupFields = (name, email, password) => {
  if (!name?.trim() || !email?.trim() || !password) {
    const error = new Error('Name, email, and password are required');
    error.statusCode = 400;
    throw error;
  }
  if (password.length < 6) {
    const error = new Error('Password must be at least 6 characters');
    error.statusCode = 400;
    throw error;
  }
};

const sendOtpOrThrow = async (email, otp) => {
  try {
    await sendOTPEmail(email, otp);
  } catch (cause) {
    console.error('OTP email delivery failed:', cause.message);
    const error = new Error('Unable to send the verification email. Please try again shortly.');
    error.statusCode = 503;
    throw error;
  }
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  requireSignupFields(name, email, password);

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    if (existing.isVerified)
      return res.status(409).json({ message: 'Email already registered. Please log in.' });

    const otp = generateOTP();
    existing.otp = otp;
    existing.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await existing.save();
    await sendOtpOrThrow(existing.email, otp);
    return res.status(200).json({ message: 'A new OTP was sent to your email', userId: existing._id });
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const user = await User.create({ name: name.trim(), email: normalizedEmail, password, otp, otpExpiry });
  await sendOtpOrThrow(user.email, otp);

  res.status(201).json({ message: 'OTP sent to email', userId: user._id });
};

exports.verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.isVerified) return res.status(400).json({ message: 'Already verified' });
  if (user.otp !== otp || user.otpExpiry < Date.now())
    return res.status(400).json({ message: 'Invalid or expired OTP' });

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = signToken(user._id);
  res.json({ message: 'Email verified', token, user: { id: user._id, name: user.name, email: user.email } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email?.trim() || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.isVerified)
    return res.status(403).json({ message: 'Please verify your email first' });

  const token = signToken(user._id);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const user = req.user;

  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    user.email = email;
  }
  if (name) user.name = name;
  await user.save();

  res.json({ user: { id: user._id, name: user.name, email: user.email } });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!(await user.comparePassword(currentPassword)))
    return res.status(400).json({ message: 'Current password is incorrect' });

  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated successfully' });
};

exports.deleteAccount = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.json({ message: 'Account deleted' });
};

exports.resendOTP = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();
  await sendOTPEmail(user.email, otp);

  res.json({ message: 'OTP resent' });
};
