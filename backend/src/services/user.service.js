'use strict';

const User = require('../models/User');
const Generation = require('../models/Generation');
const AppError = require('../utils/AppError');

class UserService {
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async updateProfile(userId, updates) {
    const allowed = ['name', 'bio', 'avatar'];
    const sanitized = Object.fromEntries(
      Object.entries(updates).filter(([key]) => allowed.includes(key))
    );

    const user = await User.findByIdAndUpdate(userId, sanitized, {
      new: true,
      runValidators: true,
    });

    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError('Current password is incorrect', 400);

    user.password = newPassword;
    await user.save();
  }

  async getStats(userId) {
    const [totalGenerations, byType] = await Promise.all([
      Generation.countDocuments({ userId }),
      Generation.aggregate([
        { $match: { userId: require('mongoose').Types.ObjectId.createFromHexString(userId.toString()) } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
    ]);

    const typeMap = { story: 0, poem: 0, joke: 0 };
    byType.forEach(({ _id, count }) => {
      typeMap[_id] = count;
    });

    return { totalGenerations, byType: typeMap };
  }
}

module.exports = new UserService();
