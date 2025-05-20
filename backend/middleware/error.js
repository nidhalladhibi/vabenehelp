// معالج الأخطاء العام
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    // سجل الخطأ للتطوير
    console.error(err);
  
    // خطأ Mongoose لمعرف غير صالح
    if (err.name === 'CastError') {
      const message = 'المعرف غير صالح';
      error = { message, statusCode: 400 };
    }
  
    // خطأ Mongoose للقيم المتكررة
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const message = `القيمة المدخلة للحقل ${field} موجودة مسبقاً`;
      error = { message, statusCode: 400 };
    }
  
    // خطأ Mongoose للحقول المطلوبة
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      error = { message, statusCode: 400 };
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'خطأ في الخادم',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };
  
  module.exports = errorHandler;