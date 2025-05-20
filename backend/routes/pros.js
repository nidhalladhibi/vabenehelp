const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const Pro = require('../models/Professional');
 // Assurez-vous que le modèle Pro existe et est correctement défini

// 📌 @route   POST /api/pros
// 📌 @desc    Créer un professionnel
// 📌 @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { domain, location, phone } = req.body;

    // Vérifiez si l'utilisateur a déjà un profil professionnel
    const existingPro = await Pro.findOne({ user: req.user._id });
    if (existingPro) {
      return res.status(400).json({ message: 'Un profil professionnel existe déjà pour cet utilisateur.' });
    }

    const pro = new Pro({
      user: req.user._id,
      domain,
      location,
      phone,
    });

    const createdPro = await pro.save();
    res.status(201).json(createdPro);
  })
);

// 📌 @route   GET /api/pros
// 📌 @desc    Obtenir tous les professionnels
// 📌 @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const pros = await Pro.find().populate('user', 'name email');
    res.json(pros);
  })
);

// 📌 @route   GET /api/pros/:id
// 📌 @desc    Obtenir un professionnel par ID
// 📌 @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const pro = await Pro.findById(req.params.id).populate('user', 'name email');

    if (pro) {
      res.json(pro);
    } else {
      res.status(404).json({ message: 'Professionnel non trouvé' });
    }
  })
);

// 📌 @route   PUT /api/pros/:id
// 📌 @desc    Modifier un professionnel
// 📌 @access  Private
router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const { domain, location, phone } = req.body;

    const pro = await Pro.findById(req.params.id);

    if (pro) {
      if (pro.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Accès refusé' });
      }

      pro.domain = domain || pro.domain;
      pro.location = location || pro.location;
      pro.phone = phone || pro.phone;

      const updatedPro = await pro.save();
      res.json(updatedPro);
    } else {
      res.status(404).json({ message: 'Professionnel non trouvé' });
    }
  })
);

// 📌 @route   DELETE /api/pros/:id
// 📌 @desc    Supprimer un professionnel
// 📌 @access  Private
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const pro = await Pro.findById(req.params.id);

    if (pro) {
      if (pro.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Accès refusé' });
      }

      await pro.remove();
      res.json({ message: 'Professionnel supprimé' });
    } else {
      res.status(404).json({ message: 'Professionnel non trouvé' });
    }
  })
);

module.exports = router;