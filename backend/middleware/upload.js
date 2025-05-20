const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { appSettings } = require('../config/config');

// ضمان وجود مجلد التحميل
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// تكوين التخزين
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    // إنشاء اسم ملف فريد باستخدام الطابع الزمني
    cb(null, `${Date.now()}-${path.parse(file.originalname).name}${path.extname(file.originalname)}`);
  }
});

// فلترة الملفات حسب النوع
const fileFilter = (req, file, cb) => {
  // التحقق من نوع الملف
  if (appSettings.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم. الأنواع المدعومة هي: ' + appSettings.allowedFileTypes.join(', ')), false);
  }
};

// إعداد التحميل
const upload = multer({
  storage: storage,
  limits: {
    fileSize: appSettings.maxFileUploadSize // حجم الملف الأقصى
  },
  fileFilter: fileFilter
});

// تحميل صورة واحدة
exports.uploadSingleImage = upload.single('image');

// تحميل عدة صور (الحد الأقصى: 5)
exports.uploadMultipleImages = upload.array('images', appSettings.maxUserPhotos);

// تحميل صور للخدمات (الحد الأقصى: 10)
exports.uploadServiceImages = upload.array('serviceImages', appSettings.maxProServicePhotos);

// معالج أخطاء Multer
exports.multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // خطأ Multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `حجم الملف كبير جدًا. الحد الأقصى هو ${appSettings.maxFileUploadSize / (1024 * 1024)} ميجابايت`
      });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'عدد الملفات تجاوز الحد المسموح به'
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // أي أخطاء أخرى
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next();
};