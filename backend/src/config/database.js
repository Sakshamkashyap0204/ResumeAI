'use strict';

const mongoose = require('mongoose');
const env = require('./env');

const CONNECT_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

async function connectDatabase() {
  try {
    await mongoose.connect(env.mongodb.uri, CONNECT_OPTIONS);
    console.info(`[DB] Connected to MongoDB`);
  } catch (error) {
    console.error(`[DB] Connection failed: ${error.message}`);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('[DB] MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error(`[DB] MongoDB error: ${error.message}`);
});

module.exports = { connectDatabase };
