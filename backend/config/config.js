// تكوينات عامة للتطبيق
module.exports = {
    // فئات الخدمات
    serviceCategories: [
      'كهرباء',
      'سباكة',
      'إلكترونيات',
      'أجهزة منزلية',
      'تكييف وتبريد',
      'سيارات',
      'نجارة',
      'أعمال بناء',
      'دهان',
      'تنظيف',
      'أخرى'
    ],
    
    // حالات الطلبات
    orderStatuses: {
      PENDING: 'قيد الانتظار',
      ACCEPTED: 'مقبول',
      IN_PROGRESS: 'قيد التنفيذ',
      COMPLETED: 'مكتمل',
      CANCELLED: 'ملغي',
      REJECTED: 'مرفوض'
    },
    
    // التكوينات العامة للتطبيق
    appSettings: {
      maxSearchRadius: 50, // كم
      defaultSearchRadius: 10, // كم
      maxFileUploadSize: 5 * 1024 * 1024, // 5 ميجابايت
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg'],
      maxUserPhotos: 5,
      maxProServicePhotos: 10,
      defaultPagination: {
        page: 1,
        limit: 20
      }
    }
  };