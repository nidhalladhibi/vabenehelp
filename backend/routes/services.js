const express = require('express');
const router = express.Router();
const {
  createService,
  updateService,
  deleteService,
  getServiceById,
  searchServices,
  getServicesByProfessional,
  getMyServices
} = require('../controllers/serviceController');
const { protect, professionalOnly } = require('../middleware/authMiddleware'); // ✅ 
// 📌 إنشاء خدمة جديدة (للمحترفين فقط)
router.post('/', protect, professionalOnly, createService);

// 📌 تحديث خدمة موجودة (للمحترفين فقط)
router.put('/:id', protect, professionalOnly, updateService);

// 📌 حذف خدمة (للمحترفين فقط)
router.delete('/:id', protect, professionalOnly, deleteService);

// 📌 البحث عن خدمات (متاحة للجميع)
router.get('/search', searchServices);

// 📌 الحصول على خدمات محترف معين (متاحة للجميع)
router.get('/pro/:id', getServicesByProfessional);

// 📌 الحصول على خدمات المحترف الحالي (للمحترفين فقط)
router.get('/me', protect, professionalOnly, getMyServices);

// 📌 الحصول على خدمة حسب ID (متاحة للجميع)
router.get('/:id', getServiceById);

module.exports = router;
