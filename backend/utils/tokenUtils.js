const crypto = require('crypto');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateOTP,
  generateResetToken,
  hashToken,
}; 