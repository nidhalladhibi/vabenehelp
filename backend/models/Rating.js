const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'يرجى إدخال التقييم'],
    min: [1, 'التقييم يجب أن يكون على الأقل 1'],
    max: [5, 'التقييم لا يمكن أن يتجاوز 5']
  },
  comment: {
    type: String,
    required: [true, 'يرجى إدخال تعليق'],
    maxlength: [500, 'التعليق لا يمكن أن يتجاوز 500 حرف']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// التحقق من فريد (يمكن للمستخدم تقييم الطلب مرة واحدة فقط)
RatingSchema.index({ order: 1, user: 1 }, { unique: true });

// تحديث معدل التقييم للمهني عند إضافة تقييم جديد
RatingSchema.post('save', async function() {
  try {
    const Professional = mongoose.model('Professional');
    const Order = mongoose.model('Order');
    
    // تحديث حالة التقييم في الطلب
    await Order.findByIdAndUpdate(this.order, { isRated: true });
    
    // حساب متوسط التقييمات
    const professional = await Professional.findById(this.professional);
    
    // الحصول على جميع التقييمات للمهني
    const ratings = await this.constructor.find({ professional: this.professional });
    
    // حساب المتوسط
    const totalRating = ratings.reduce((sum, item) => sum + item.rating, 0);
    const avgRating = totalRating / ratings.length;
    
    // تحديث بيانات المهني
    await Professional.findByIdAndUpdate(this.professional, {
      averageRating: avgRating,
      numberOfRatings: ratings.length
    });
  } catch (err) {
    console.error('خطأ في تحديث متوسط التقييمات:', err);
  }
});

module.exports = mongoose.model('Rating', RatingSchema);