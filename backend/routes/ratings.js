const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const Rating = require('../models/Rating');
const Professional = require('../models/Professional');

// 📌 @route   POST /api/ratings
// 📌 @desc    Ajouter une note pour un professionnel
// 📌 @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { professionalId, rating, comment } = req.body;

  const pro = await Professional.findById(professionalId);
  if (!pro) {
    res.status(404);
    throw new Error('Professionnel non trouvé');
  }

  const existingRating = await Rating.findOne({ user: req.user._id, professional: professionalId });
  if (existingRating) {
    res.status(400);
    throw new Error('Vous avez déjà noté ce professionnel');
  }

  const createdRating = await Rating.create({
    user: req.user._id,
    professional: professionalId,
    rating,
    comment
  });

  res.status(201).json(createdRating);
}));

// 📌 @route   GET /api/ratings
// 📌 @desc    Obtenir toutes les notes
// 📌 @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const ratings = await Rating.find()
    .populate('user', 'name')
    .populate('professional', 'domain location');
    
  res.json(ratings);
}));

// 📌 @route   GET /api/ratings/:id
// 📌 @desc    Obtenir une note par ID
// 📌 @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const rating = await Rating.findById(req.params.id)
    .populate('user', 'name');

  if (!rating) {
    res.status(404);
    throw new Error('Note non trouvée');
  }

  res.json(rating);
}));


// 📌 @route   PUT /api/ratings/:id
// 📌 @desc    Modifier une note
// 📌 @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const existingRating = await Rating.findById(req.params.id);

  if (!existingRating) {
    res.status(404);
    throw new Error('Note non trouvée');
  }

  if (existingRating.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Non autorisé à modifier cette note');
  }

  existingRating.rating = rating ?? existingRating.rating;
  existingRating.comment = comment ?? existingRating.comment;

  const updated = await existingRating.save();
  res.json(updated);
}));

// 📌 @route   DELETE /api/ratings/:id
// 📌 @desc    Supprimer une note
// 📌 @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const rating = await Rating.findById(req.params.id);

  if (!rating) {
    res.status(404);
    throw new Error('Note non trouvée');
  }

  if (rating.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Non autorisé à supprimer cette note');
  }

  await rating.deleteOne();
  res.json({ message: 'Note supprimée' });
}));

module.exports = router;
