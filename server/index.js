require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const configuredOrigins = [process.env.CLIENT_URL, process.env.RENDER_EXTERNAL_URL]
  .filter(Boolean)
  .join(',')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set(configuredOrigins);
const isLocalDevelopmentOrigin = (origin) =>
  /^http:\/\/(localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin);
const getRequestOrigin = (req) => {
  const protocol = req.get('x-forwarded-proto')?.split(',')[0].trim() || req.protocol;
  return `${protocol}://${req.get('host')}`;
};

app.use(cors((req, callback) => {
  const origin = req.get('origin');
  // Permit the app's own deployed domain, configured domains, and local Vite ports.
  if (!origin || origin === getRequestOrigin(req) || isLocalDevelopmentOrigin(origin) || allowedOrigins.has(origin)) {
    return callback(null, { origin: true, credentials: true });
  }
  return callback(new Error(`Origin ${origin} is not allowed by CORS`));
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// In production, the Express service also serves the compiled React app.
const clientBuildPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => res.sendFile(path.join(clientBuildPath, 'index.html')));
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch((err) => {
  console.error('Server startup failed:', err.message);
  process.exit(1);
});
