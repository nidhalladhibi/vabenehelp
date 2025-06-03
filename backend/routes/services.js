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
const { protect, professionalOnly } = require('../middleware/authMiddleware');

// 📌 Routes spécifiques d'abord
router.get('/search', searchServices);
router.get('/pro/:id', getServicesByProfessional);
router.get('/me', protect, professionalOnly, getMyServices);

// 📌 Routes professionnelles sécurisées
router.post('/', protect, professionalOnly, createService);
router.put('/:id', protect, professionalOnly, updateService);
router.delete('/:id', protect, professionalOnly, deleteService);

// 📌 Route générique à la fin
router.get('/:id', getServiceById);

module.exports = router;
