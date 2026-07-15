'use strict';

const app = require('./app');
const { connectDatabase } = require('./config/database');
const env = require('./config/env');

async function startServer() {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.info(`[Server] Running on port ${env.port} in ${env.nodeEnv} mode`);
  });

  function shutdown(signal) {
    console.info(`[Server] ${signal} received — shutting down gracefully`);
    server.close(() => {
      console.info('[Server] HTTP server closed');
      process.exit(0);
    });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => process.exit(1), 10_000);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('[Server] Unhandled rejection:', reason);
    shutdown('unhandledRejection');
  });
}

startServer();
