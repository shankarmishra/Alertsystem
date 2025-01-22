// OTP generation utility
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

// Validate phone number format
const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
};

// OTP expiration check
const isOtpExpired = (timestamp, expiryTime) => {
  return Date.now() - timestamp > expiryTime;
};

module.exports = {
  generateOtp,
  validatePhoneNumber,
  isOtpExpired,
};
