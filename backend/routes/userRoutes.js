const express = require('express');
const { sendOtp, verifyOtp } = require('../controllers/UserController');

const router = express.Router();
router.use(express.json());

// Routes for sending and verifying OTP
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
