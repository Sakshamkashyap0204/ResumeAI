const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadResume, getUserResumes } = require('../controllers/resumeController');
const { analyzeResume } = require('../controllers/analysisController');

router.use(protect);
router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getUserResumes);
router.post('/analyze', analyzeResume);

module.exports = router;
