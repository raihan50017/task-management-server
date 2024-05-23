const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Extract JWT token from request headers
  const token = req.header('Authorization');

  // Check if token is present
  if (!token) {
    return res.status(401).json({ errors:{
        message: "Access denied. No token provided",
    } });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Add userId to request object
    next(); // Proceed to next middleware
  } catch (error) {
    res.status(401).json({ errors:{
        message: "Invalid token",
    }});
  }
};

module.exports = authenticate;
