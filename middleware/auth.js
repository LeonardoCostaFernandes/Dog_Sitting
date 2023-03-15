const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log("essa é a req.cookies", req.cookies);

  console.log("esse é o cookie", 'cookies')

  if(req.cookies.token) {
  token = req.cookies.token
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded.id);

    req.user = await User.findById(decoded.id);
    
    next();
  } catch (err) {
    console.log("não era pra estar dando esse erro")
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }
});

