const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // 1. Get and validate authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      message: 'Authorization header is required' 
    });
  }

  // 2. Extract and clean token
  let token;
  try {
    token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
    if (!token) throw new Error('Empty token');
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization header format'
    });
  }

  // 3. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validate payload structure
    if (!decoded.id && !decoded.userId) {
      return res.status(400).json({
        success: false,
        message: 'Token missing user identifier',
        details: 'Payload must contain either "id" or "userId"'
      });
    }
    
    // Standardize user object in request
    req.user = {
      id: decoded.id || decoded.userId, // Supports both fields
      ...(decoded.role && { role: decoded.role }) // Optional additional claims
    };
    
    next();
  } catch (error) {
    // Enhanced error handling
    const response = {
      success: false,
      message: 'Authentication failed'
    };
    
    if (error.name === 'TokenExpiredError') {
      response.message = 'Session expired';
      response.expiredAt = error.expiredAt;
      response.code = 'TOKEN_EXPIRED';
      return res.status(401).json(response);
    }
    
    if (error.name === 'JsonWebTokenError') {
      response.message = 'Invalid token';
      response.code = 'INVALID_TOKEN';
      return res.status(401).json(response);
    }
    
    // System errors
    console.error('JWT Verification Error:', error);
    response.message = 'Authentication error';
    response.code = 'AUTH_ERROR';
    return res.status(500).json(response);
  }
};

























module.exports = verifyToken;