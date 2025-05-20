const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// @desc    تحديث ملف المستخدم الشخصي
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, phone, location } = req.body;

    // البحث عن المستخدم وتحديثه
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, location },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        location: updatedUser.location,
        photo: updatedUser.photo
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في تحديث الملف الشخصي',
      error: err.message
    });
  }
};

// @desc    تحديث كلمة المرور
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // الحصول على المستخدم مع كلمة المرور
    const user = await User.findById(req.user._id).select('+password');

    // التحقق من كلمة المرور الحالية
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة'
      });
    }

    // تشفير كلمة المرور الجديدة
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // تحديث كلمة المرور
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'تم تحديث كلمة المرور بنجاح'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في تحديث كلمة المرور',
      error: err.message
    });
  }
};

// @desc    تحميل صورة الملف الشخصي
// @route   PUT /api/users/photo
// @access  Private
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'يرجى تحميل صورة'
      });
    }

    // تحديث مسار الصورة
    const photoPath = req.file.filename;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { photo: photoPath },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        photo: updatedUser.photo
      },
      message: 'تم تحميل الصورة بنجاح'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في تحميل الصورة',
      error: err.message
    });
  }
};

// @desc    الحصول على سجل المستخدم
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في الحصول على بيانات المستخدم',
      error: err.message
    });
  }
};

// @desc    الحصول على جميع المستخدمين
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    // البحث عن المستخدمين مع تصفية حسب الدور إذا تم تحديده
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // التصفحة والحد
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await User.countDocuments(filter);

    // الحصول على المستخدمين
    const users = await User.find(filter)
      .select('-password')
      .skip(startIndex)
      .limit(limit);

    // معلومات التصفح
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: users.length,
      pagination,
      total,
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في الحصول على المستخدمين',
      error: err.message
    });
  }
};
