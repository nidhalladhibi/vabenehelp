const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
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
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  status: {
    type: String,
    enum: Object.keys(require('../config/config').orderStatuses),
    default: 'PENDING'
  },
  details: {
    type: String,
    required: [true, 'يرجى إدخال تفاصيل الطلب'],
    maxlength: [1000, 'تفاصيل الطلب لا يمكن أن تتجاوز 1000 حرف']
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  scheduledDate: {
    type: Date,
    required: [true, 'يرجى تحديد تاريخ الخدمة']
  },
  scheduledTime: {
    type: String,
    required: [true, 'يرجى تحديد وقت الخدمة']
  },
  price: {
    type: Number,
    min: [0, 'السعر لا يمكن أن يكون سالبًا']
  },
  paymentStatus: {
    type: String,
    enum: ['UNPAID', 'PAID', 'REFUNDED'],
    default: 'UNPAID'
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'CARD', 'BANK_TRANSFER', 'ONLINE'],
    default: 'CASH'
  },
  notes: {
    type: String,
    maxlength: [500, 'الملاحظات لا يمكن أن تتجاوز 500 حرف']
  },
  photos: {
    type: [String],
    default: []
  },
  cancellationReason: {
    type: String,
    maxlength: [500, 'سبب الإلغاء لا يمكن أن يتجاوز 500 حرف']
  },
  progressUpdates: [
    {
      status: {
        type: String,
        enum: Object.keys(require('../config/config').orderStatuses)
      },
      message: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  isRated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

// تحديث سجل حالة الطلب عند تغيير الحالة
OrderSchema.pre('save', async function(next) {
  if (this.isModified('status')) {
    this.progressUpdates.push({
      status: this.status,
      message: `تم تغيير حالة الطلب إلى "${require('../config/config').orderStatuses[this.status]}"`,
      timestamp: Date.now()
    });

    // تحديث تاريخ الإكمال إذا كانت الحالة "مكتمل"
    if (this.status === 'COMPLETED') {
      this.completedAt = Date.now();
    }
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);