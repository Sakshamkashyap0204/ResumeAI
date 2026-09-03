'use strict';

const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { signAccessToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const emailService = require('./email.service');

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const OTP_TTL_MS = 15 * 60 * 1000; // 15 minutes

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

class AuthService {
  async register(name, email, password) {
    const existing = await User.findOne({ email });
    if (existing && existing.isEmailVerified) {
      throw new AppError('An account with this email already exists', 409);
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + OTP_TTL_MS);

    if (existing && !existing.isEmailVerified) {
      // Resend OTP to existing unverified account
      existing.emailVerificationOtp = otp;
      existing.emailVerificationExpires = otpExpires;
      await existing.save();
      await emailService.sendVerificationOtp(email, existing.name, otp);
      return { email, message: 'Verification code resent' };
    }

    const user = await User.create({
      name,
      email,
      password,
      emailVerificationOtp: otp,
      emailVerificationExpires: otpExpires,
    });

    await emailService.sendVerificationOtp(email, name, otp);
    return { email: user.email, message: 'Verification code sent' };
  }

  async verifyEmail(email, otp) {
    const user = await User.findOne({ email })
      .select('+emailVerificationOtp +emailVerificationExpires');

    if (!user) throw new AppError('Account not found', 404);
    if (user.isEmailVerified) throw new AppError('Email already verified', 400);

    if (
      !user.emailVerificationOtp ||
      user.emailVerificationOtp !== otp ||
      user.emailVerificationExpires < new Date()
    ) {
      throw new AppError('Invalid or expired verification code', 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationOtp = null;
    user.emailVerificationExpires = null;
    await user.save();

    return user.toSafeObject();
  }

  async resendVerificationOtp(email) {
    const user = await User.findOne({ email })
      .select('+emailVerificationOtp +emailVerificationExpires');

    if (!user) throw new AppError('Account not found', 404);
    if (user.isEmailVerified) throw new AppError('Email already verified', 400);

    const otp = generateOtp();
    user.emailVerificationOtp = otp;
    user.emailVerificationExpires = new Date(Date.now() + OTP_TTL_MS);
    await user.save();

    await emailService.sendVerificationOtp(email, user.name, otp);
  }

  async login(email, password, meta = {}) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) throw new AppError('Account has been deactivated', 403);

    if (!user.isEmailVerified) {
      throw new AppError('Please verify your email before logging in', 403);
    }

    const accessToken = signAccessToken({ userId: user._id });
    const refreshToken = await this._createRefreshToken(user._id, meta);

    return { user: user.toSafeObject(), accessToken, refreshToken };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user || !user.isEmailVerified) return;

    const otp = generateOtp();
    user.passwordResetOtp = otp;
    user.passwordResetExpires = new Date(Date.now() + OTP_TTL_MS);
    await user.save();

    await emailService.sendPasswordResetOtp(email, user.name, otp);
  }

  async resetPassword(email, otp, newPassword) {
    const user = await User.findOne({ email })
      .select('+passwordResetOtp +passwordResetExpires +password');

    if (!user) throw new AppError('Account not found', 404);

    if (
      !user.passwordResetOtp ||
      user.passwordResetOtp !== otp ||
      user.passwordResetExpires < new Date()
    ) {
      throw new AppError('Invalid or expired reset code', 400);
    }

    user.password = newPassword;
    user.passwordResetOtp = null;
    user.passwordResetExpires = null;
    await user.save();

    // Revoke all refresh tokens for security
    await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });
  }

  async refreshAccessToken(incomingToken) {
    const stored = await RefreshToken.findOne({
      token: incomingToken,
      isRevoked: false,
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError('Refresh token is invalid or expired', 401);
    }

    const user = await User.findById(stored.userId);
    if (!user || !user.isActive) throw new AppError('User not found', 401);

    await RefreshToken.findByIdAndUpdate(stored._id, { isRevoked: true });
    const newRefreshToken = await this._createRefreshToken(user._id, {});
    const accessToken = signAccessToken({ userId: user._id });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken) {
    if (!refreshToken) return;
    await RefreshToken.findOneAndUpdate({ token: refreshToken }, { isRevoked: true });
  }

  async _createRefreshToken(userId, meta) {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await RefreshToken.create({
      userId,
      token,
      expiresAt,
      userAgent: meta.userAgent || null,
      ipAddress: meta.ipAddress || null,
    });
    return token;
  }
}

module.exports = new AuthService();
