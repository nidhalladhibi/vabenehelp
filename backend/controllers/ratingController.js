const Rating = require('../models/Rating');
const Order = require('../models/Order');
const Professional = require('../models/Professional');
const { validationResult } = require('express-validator');

// @desc    الحصول على تقييمات مهني
// @route   GET /api/ratings/professional/:id
// @access  Public
exports.getProfessionalRatings = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const professionalId = req.params.id;
    
    // التحقق من وجود المهني
    const professional = await Professional.findById(professionalId);
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: 'المهني غير موجود'
      });
    }
    
    const total = await Rating.countDocuments({ professional: professionalId });
    
    // جلب التقييمات مع معلومات المستخدم والطلب
    const ratings = await Rating.find({ professional: professionalId })
      .populate({
        path: 'user',
        select: 'name photo'
      })
      .populate({
        path: 'order',
        select: 'service',
        populate: {
          path: 'service',
          select: 'title'
        }
      })
      .sort({ createdAt: -1 })
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
      count: ratings.length,
      pagination,
      total,
      data: ratings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في الحصول على التقييمات',
      error: err.message
    });
  }
};

// @desc    إضافة تقييم لمهني
// @route   POST /api/ratings
// @access  Private
exports.addRating = async (req, res) => {
  try {
    // التحقق من صحة البيانات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { orderId, professionalId, rating, comment } = req.body;

    // التحقق من وجود الطلب وأنه مكتمل
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    // التحقق من أن المستخدم هو صاحب الطلب
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بتقييم هذا الطلب'
      });
    }

    // التحقق من أن الطلب مكتمل
    if (order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'يمكن تقييم الطلبات المكتملة فقط'
      });
    }

    // التحقق من أن المهني هو نفسه المهني في الطلب
    if (order.professional.toString() !== professionalId) {
      return res.status(400).json({
        success: false,
        message: 'بيانات المهني غير متطابقة مع الطلب'
      });
    }

    // التحقق من عدم وجود تقييم سابق لهذا الطلب
    const existingRating = await Rating.findOne({ order: orderId });
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'تم تقييم هذا الطلب مسبقًا'
      });
    }

    // إنشاء التقييم
    const newRating = await Rating.create({
      user: req.user._id,
      professional: professionalId,
      order: orderId,
      rating,
      comment
    });

    // تحديث متوسط التقييم للمهني
    const professional = await Professional.findById(professionalId);
    
    // حساب متوسط التقييم الجديد
    const allRatings = await Rating.find({ professional: professionalId });
    const totalRating = allRatings.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / allRatings.length;
    
    // تحديث المهني
    professional.averageRating = averageRating;
    professional.numberOfRatings = allRatings.length;
    await professional.save();

    res.status(201).json({
      success: true,
      data: newRating
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في إضافة التقييم',
      error: err.message
    });
  }
};

// @desc    تحديث تقييم
// @route   PUT /api/ratings/:id
// @access  Private
exports.updateRating = async (req, res) => {
  try {
    // التحقق من صحة البيانات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { rating, comment } = req.body;

    // البحث عن التقييم
    let existingRating = await Rating.findById(req.params.id);
    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: 'التقييم غير موجود'
      });
    }

    // التحقق من ملكية التقييم
    if (existingRating.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بتعديل هذا التقييم'
      });
    }

    // تحديث التقييم
    existingRating.rating = rating || existingRating.rating;
    existingRating.comment = comment || existingRating.comment;
    await existingRating.save();

    // تحديث متوسط التقييم للمهني
    const professional = await Professional.findById(existingRating.professional);
    
    // حساب متوسط التقييم الجديد
    const allRatings = await Rating.find({ professional: existingRating.professional });
    const totalRating = allRatings.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / allRatings.length;
    
    // تحديث المهني
    professional.averageRating = averageRating;
    await professional.save();

    res.status(200).json({
      success: true,
      data: existingRating
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في تحديث التقييم',
      error: err.message
    });
  }
};

// @desc    حذف تقييم
// @route   DELETE /api/ratings/:id
// @access  Private
exports.deleteRating = async (req, res) => {
  try {
    // البحث عن التقييم
    const rating = await Rating.findById(req.params.id);
    
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'التقييم غير موجود'
      });
    }

    // التحقق من ملكية التقييم
    if (rating.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بحذف هذا التقييم'
      });
    }

    const professionalId = rating.professional;

    // حذف التقييم
    await rating.remove();

    // تحديث متوسط التقييم للمهني
    const professional = await Professional.findById(professionalId);
    
    // حساب متوسط التقييم الجديد
    const allRatings = await Rating.find({ professional: professionalId });
    
    if (allRatings.length === 0) {
      professional.averageRating = 0;
      professional.numberOfRatings = 0;
    } else {
      const totalRating = allRatings.reduce((sum, item) => sum + item.rating, 0);
      const averageRating = totalRating / allRatings.length;
      professional.averageRating = averageRating;
      professional.numberOfRatings = allRatings.length;
    }
    
    await professional.save();

    res.status(200).json({
      success: true,
      message: 'تم حذف التقييم بنجاح'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في حذف التقييم',
      error: err.message
    });
  }
};