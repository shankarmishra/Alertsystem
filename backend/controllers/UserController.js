const express = require('express');
const app = express();
const User = require('../models/User');
const { generateOtp, validatePhoneNumber, isOtpExpired } = require('../utils/otpUtils');
const { sendOtpMessage } = require('../utils/twilioUtils');

// Middleware to parse JSON payloads
app.use(express.json());

const otpStore = {};
const OTP_RESEND_LIMIT = 2 * 60 * 1000; // 2 minutes
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Send OTP API
 */
const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number.' });
    }

    // Prevent frequent OTP resend
    if (otpStore[phoneNumber] && Date.now() - otpStore[phoneNumber].timestamp < OTP_RESEND_LIMIT) {
      return res.status(429).json({ error: 'OTP recently sent. Try again later.' });
    }

    // Generate and store OTP
    const otp = generateOtp();
    otpStore[phoneNumber] = { otp, timestamp: Date.now() };

    try {
      // Send OTP via Twilio
      await sendOtpMessage(phoneNumber, otp);
      res.status(200).json({ success: true, message: 'OTP sent successfully.' });
    } catch (error) {
      console.error('Twilio Error:', error);
      res.status(500).json({ error: 'Failed to send OTP.' });
    }
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ error: 'Failed to send OTP.' });
  }
};

/**
 * Verify OTP API
 */
const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Validate input
    if (!phoneNumber || !otp || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: 'Invalid input.' });
    }

    const storedOtpData = otpStore[phoneNumber];

    // Check OTP expiry or non-existence
    if (!storedOtpData || isOtpExpired(storedOtpData.timestamp, OTP_EXPIRY_TIME)) {
      return res.status(400).json({ error: 'OTP expired. Request a new one.' });
    }

    // Validate OTP
    if (storedOtpData.otp === parseInt(otp, 10)) {
      // Verify or create user
      let user = await User.findOneAndUpdate(
        { phoneNumber },
        { isVerified: true },
        { upsert: true, new: true }
      );

      // Remove OTP from store
      delete otpStore[phoneNumber];
      res.status(200).json({ success: true, message: 'OTP verified successfully.', user });
    } else {
      res.status(400).json({ error: 'Invalid OTP.' });
    }
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ error: 'Failed to verify OTP.' });
  }
};

module.exports = { sendOtp, verifyOtp };
