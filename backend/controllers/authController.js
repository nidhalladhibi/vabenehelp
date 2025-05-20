const User = require('../models/users');
const Professional = require('../models/Professional');
const { generateToken } = require('../config/jwt');
const { validationResult } = require('express-validator');

// @desc    تسجيل مستخدم جديد
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone, role, location } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل مسبقًا',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'user',
      location,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        photo: user.photo,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في تسجيل المستخدم',
      error: err.message,
    });
  }
};

// @desc    تسجيل الدخول
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الاعتماد غير صحيحة',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الاعتماد غير صحيحة',
      });
    }

    const token = generateToken(user._id);

    let professional = null;
    if (user.role === 'pro') {
      professional = await Professional.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        photo: user.photo,
        professional: professional
          ? {
              _id: professional._id,
              specializations: professional.specializations,
              isVerified: professional.isVerified,
              averageRating: professional.averageRating,
              numberOfRatings: professional.numberOfRatings,
            }
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في تسجيل الدخول',
      error: err.message,
    });
  }
};

// @desc    تسجيل مهني جديد
// @route   POST /api/auth/register/pro
// @access  Public
exports.registerPro = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      name,
      email,
      password,
      phone,
      location,
      bio,
      specializations,
      experience,
      availability,
      serviceRadius,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل مسبقًا',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'pro',
      location,
    });

    const professional = await Professional.create({
      user: user._id,
      bio,
      specializations,
      experience,
      availability,
      serviceRadius,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        photo: user.photo,
        professional: {
          _id: professional._id,
          specializations: professional.specializations,
          serviceRadius: professional.serviceRadius,
          experience: professional.experience,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في تسجيل المهني',
      error: err.message,
    });
  }
};

// @desc    الحصول على المستخدم الحالي
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    let professional = null;
    if (user.role === 'pro') {
      professional = await Professional.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        photo: user.photo,
        professional: professional
          ? {
              _id: professional._id,
              bio: professional.bio,
              specializations: professional.specializations,
              experience: professional.experience,
              availability: professional.availability,
              serviceRadius: professional.serviceRadius,
              isVerified: professional.isVerified,
              isAvailable: professional.isAvailable,
              averageRating: professional.averageRating,
              numberOfRatings: professional.numberOfRatings,
            }
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في الحصول على بيانات المستخدم',
      error: err.message,
    });
  }
};

module.exports = {
  register: exports.register,
  login: exports.login,
  registerPro: exports.registerPro,
  getMe: exports.getMe,
};