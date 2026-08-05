const router = require('express').Router();
const { signup, verifyOTP, login, resendOTP } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/resend-otp', resendOTP);

module.exports = router;
