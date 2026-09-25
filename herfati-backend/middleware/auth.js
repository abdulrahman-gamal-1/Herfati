const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Verifies the JWT sent in the Authorization header and attaches the user to req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('غير مصرح، لا يوجد توكن دخول');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401);
      throw new Error('المستخدم غير موجود');
    }
    next();
  } catch (err) {
    res.status(401);
    throw new Error('التوكن غير صالح أو منتهي');
  }
});

// Restricts a route to one or more roles, e.g. authorize('artisan', 'admin')
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('لا تملك صلاحية القيام بهذا الإجراء');
  }
  next();
};

module.exports = { protect, authorize };
