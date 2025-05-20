const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définir le schéma utilisateur
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'الاسم مطلوب'],
    },
    email: {
      type: String,
      required: [true, 'البريد الإلكتروني مطلوب'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'يرجى إدخال بريد إلكتروني صالح',
      ],
    },
    password: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة'],
      minlength: 6,
      select: false, // لا تُرجع كلمة المرور في النتائج
    },
    phone: {
      type: String,
      required: [true, 'رقم الهاتف مطلوب'],
    },
    role: {
      type: String,
      enum: ['user', 'pro', 'admin'],
      default: 'user',
    },
    location: {
      type: String,
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 تشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ التحقق من كلمة المرور أثناء تسجيل الدخول
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
