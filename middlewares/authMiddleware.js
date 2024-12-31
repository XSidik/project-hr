const jwt = require('jwt-simple');
const secretKey = 'my_secret_key_is_asdfwer@#!$%wefwecd'; // Your JWT secret key

function authenticate(req, res, next) {
  // Check for token in request headers
  const token = req.headers.authorization;

  // If token is missing, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Decode and verify the token
    const decoded = jwt.decode(token, secretKey);

    // Attach the decoded user data to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token is invalid, return 401 Unauthorized
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = authenticate;
