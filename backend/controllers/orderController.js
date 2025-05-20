const Order = require('../models/Order');
const Service = require('../models/Service');
const Professional = require('../models/Professional');
const User = require('../models/users');
const { validationResult } = require('express-validator');

// @desc    إنشاء طلب جديد
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    // التحقق من صحة البيانات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { serviceId, date, time, address, notes } = req.body;

    // التحقق من وجود الخدمة
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'الخدمة غير موجودة'
      });
    }

    // التحقق من توفر الخدمة
    if (!service.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'الخدمة غير متاحة حاليًا'
      });
    }

    // الحصول على معلومات المهني
    const professional = await Professional.findById(service.professional);
    if (!professional || !professional.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'المهني غير متاح حاليًا'
      });
    }

    // إنشاء الطلب
    const order = await Order.create({
      user: req.user._id,
      professional: service.professional,
      service: serviceId,
      date,
      time,
      address,
      notes,
      totalPrice: service.price,
      status: 'pending'
    });

    // تحميل معلومات الخدمة والمهني
    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: 'service',
        select: 'title price duration category'
      })
      .populate({
        path: 'professional',
        select: 'user',
        populate: {
          path: 'user',
          select: 'name photo phone'
        }
      });

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في إنشاء الطلب',
      error: err.message
    });
  }
};

// @desc    الحصول على طلب محدد
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'service',
        select: 'title price duration category description'
      })
      .populate({
        path: 'professional',
        select: 'user averageRating',
        populate: {
          path: 'user',
          select: 'name photo phone'
        }
      })
      .populate({
        path: 'user',
        select: 'name photo phone'
      });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    // التحقق من صلاحية الوصول
    if (
      order.user._id.toString() !== req.user._id.toString() && 
      order.professional.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بالوصول إلى هذا الطلب'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في الحصول على الطلب',
      error: err.message
    });
  }
};

// @desc    الحصول على طلبات المستخدم
// @route   GET /api/orders/user
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    // معايير التصفية
    const filter = { user: req.user._id };
    
    // تصفية حسب الحالة
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // التصفحة والحد
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Order.countDocuments(filter);

    // الحصول على الطلبات
    const orders = await Order.find(filter)
      .populate({
        path: 'service',
        select: 'title price'
      })
      .populate({
        path: 'professional',
        select: 'user',
        populate: {
          path: 'user',
          select: 'name photo'
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
      count: orders.length,
      pagination,
      total,
      data: orders
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في الحصول على الطلبات',
      error: err.message
    });
  }
};

// @desc    الحصول على طلبات المهني
// @route   GET /api/orders/professional
// @access  Private/Pro
exports.getProfessionalOrders = async (req, res) => {
  try {
    // الحصول على معرف المهني
    const professional = await Professional.findOne({ user: req.user._id });
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على سجل المهني'
      });
    }

    // معايير التصفية
    const filter = { professional: professional._id };
    
    // تصفية حسب الحالة
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // التصفحة والحد
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Order.countDocuments(filter);

    // الحصول على الطلبات
    const orders = await Order.find(filter)
      .populate({
        path: 'service',
        select: 'title price'
      })
      .populate({
        path: 'user',
        select: 'name photo'
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
      count: orders.length,
      pagination,
      total,
      data: orders
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في الحصول على الطلبات',
      error: err.message
    });
  }
};

// @desc    تحديث حالة الطلب (للمهني)
// @route   PUT /api/orders/:id/status
// @access  Private/Pro
exports.updateOrderStatus = async (req, res) => {
  try {
    // التحقق من صحة البيانات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { status } = req.body;

    // الحصول على معرف المهني
    const professional = await Professional.findOne({ user: req.user._id });
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على سجل المهني'
      });
    }

    // البحث عن الطلب
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    // التحقق من ملكية الطلب
    if (order.professional.toString() !== professional._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بتعديل هذا الطلب'
      });
    }

    // التحقق من صحة تسلسل الحالات
    const validStatusTransitions = {
      'pending': ['accepted', 'rejected'],
      'accepted': ['completed', 'cancelled'],
      'completed': [],
      'rejected': [],
      'cancelled': []
    };

    if (!validStatusTransitions[order.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `لا يمكن تغيير حالة الطلب من "${order.status}" إلى "${status}"`
      });
    }

    // تحديث حالة الطلب
    order.status = status;
    if (status === 'accepted') {
      order.acceptedAt = Date.now();
    } else if (status === 'completed') {
      order.completedAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في تحديث حالة الطلب',
      error: err.message
    });
  }
};

// @desc    إلغاء طلب (للمستخدم)
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    // البحث عن الطلب
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    // التحقق من ملكية الطلب
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بإلغاء هذا الطلب'
      });
    }

    // التحقق من إمكانية الإلغاء
    if (order.status !== 'pending' && order.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن إلغاء هذا الطلب في حالته الحالية'
      });
    }

    // تحديث حالة الطلب
    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'فشل في إلغاء الطلب',
      error: err.message
    });
  }
};