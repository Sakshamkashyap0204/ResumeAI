'use strict';

const router = require('express').Router();
const multer = require('multer');
const attachmentController = require('../controllers/attachment.controller');
const { authenticate } = require('../middlewares/auth');
const { sendError } = require('../utils/apiResponse');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    const allowed = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.mimetype)) return callback(new Error('Unsupported attachment type'));
    callback(null, true);
  },
});

router.use(authenticate);
router.post('/', (req, res, next) => upload.single('file')(req, res, (error) => {
  if (error) return sendError(res, error.code === 'LIMIT_FILE_SIZE' ? 413 : 415, error.message);
  next();
}), attachmentController.upload);

module.exports = router;