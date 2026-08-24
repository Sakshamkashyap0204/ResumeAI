const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../services/emailService');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });

  // Let a user who left before OTP verification resume signup without creating
  // a duplicate account. Verified accounts must use the login form instead.
  if (existing) {
    if (existing.isVerified) {
      return res.status(400).json({ message: 'This email is already registered. Please log in.' });
    }

    const otp = generateOTP();
    existing.otp = otp;
    existing.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await existing.save();
    await sendOTPEmail(existing.email, otp);

    return res.json({ message: 'A new OTP was sent to your email', userId: existing._id });
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    password,
    otp,
    otpExpiry,
    isVerified: false,
  });
  await sendOTPEmail(email, otp);

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
  const user = await User.findOne({ email });

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
  if (user.isVerified) return res.status(400).json({ message: 'This email is already verified. Please log in.' });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();
  await sendOTPEmail(user.email, otp);

  res.json({ message: 'OTP resent' });
};
