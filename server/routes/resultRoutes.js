const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getResult, getUserResults, deleteResult } = require('../controllers/analysisController');

router.use(protect);
router.get('/', getUserResults);
router.get('/:id', getResult);
router.delete('/:id', deleteResult);

module.exports = router;
