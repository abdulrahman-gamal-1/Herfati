const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, craft, region, bio } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('من فضلك أدخل الاسم والبريد الإلكتروني وكلمة المرور');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('هذا البريد الإلكتروني مستخدم بالفعل');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'artisan' ? 'artisan' : 'buyer',
    craft,
    region,
    bio,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { register, login, getMe };
