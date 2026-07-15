'use strict';

const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/apiResponse');

async function getProfile(req, res, next) {
  try {
    const user = await userService.getProfile(req.user._id);
    sendSuccess(res, 200, 'Profile retrieved', { user });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    sendSuccess(res, 200, 'Profile updated', { user });
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user._id, currentPassword, newPassword);
    sendSuccess(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
}

async function getStats(req, res, next) {
  try {
    const stats = await userService.getStats(req.user._id);
    sendSuccess(res, 200, 'Stats retrieved', { stats });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProfile, updateProfile, changePassword, getStats };
