'use strict';

const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/apiResponse');
const env = require('../config/env');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password);
    sendSuccess(res, 201, 'Verification code sent to your email', { email: result.email });
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { email, otp } = req.body;
    const user = await authService.verifyEmail(email, otp);
    sendSuccess(res, 200, 'Email verified successfully', { user });
  } catch (error) {
    next(error);
  }
}

async function resendOtp(req, res, next) {
  try {
    const { email } = req.body;
    await authService.resendVerificationOtp(email);
    sendSuccess(res, 200, 'Verification code resent');
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const meta = { userAgent: req.headers['user-agent'], ipAddress: req.ip };
    const { user, accessToken, refreshToken } = await authService.login(email, password, meta);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, 200, 'Login successful', { user, accessToken });
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    // Always return success to prevent email enumeration
    sendSuccess(res, 200, 'If an account exists, a reset code has been sent');
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
    sendSuccess(res, 200, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const incomingToken = req.cookies?.refreshToken;
    const { accessToken, refreshToken } = await authService.refreshAccessToken(incomingToken);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, 200, 'Token refreshed', { accessToken });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    await authService.logout(refreshToken);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    sendSuccess(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = { register, verifyEmail, resendOtp, login, forgotPassword, resetPassword, refresh, logout };
