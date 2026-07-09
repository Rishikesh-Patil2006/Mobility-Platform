const jwt = require('jsonwebtoken');
const config = require('./env');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.accessSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken
};
