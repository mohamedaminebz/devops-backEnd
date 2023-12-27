const jwt = require("jsonwebtoken");

const AccessToken = (data, duration) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: duration,
  });
};

const RefreshToken = (data, duration) => {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: duration,
  });
};
module.exports = { AccessToken, RefreshToken };
