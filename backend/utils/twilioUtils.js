const twilio = require('twilio');

// Initialize Twilio client with fallback to environment variables or hardcoded values
const client = new twilio(
  process.env.TWILIO_SID || 'AC254c89dd6a604cec4fca806caafb2658', 
  process.env.TWILIO_AUTH_TOKEN || 'dfadae96b2f66e0ad39a0aab38ae2fe6'
);

// Send OTP message via Twilio
const sendOtpMessage = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}. It expires in 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER || '+19124613261', // Ensure the phone number is a string
      to: phoneNumber,
    });
    return message;
  } catch (error) {
    throw new Error('Failed to send OTP via Twilio: ' + error.message);
  }
};

module.exports = { sendOtpMessage };
