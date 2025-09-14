const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // jwt.sign() creates the token.
  // It takes the user's unique ID as the payload, our secret key,
  // and an option for when it expires (e.g., in 30 days).
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;

