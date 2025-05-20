const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order'); // Assure-toi que ce fichier existe

// 📌 @route   POST /api/orders
// 📌 @desc    Create new order
// 📌 @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { serviceId, date, time, address, notes } = req.body;

  if (!serviceId || !date || !time || !address) {
    res.status(400);
    throw new Error('Tous les champs requis doivent être remplis');
  }

  const order = new Order({
    user: req.user._id,
    service: serviceId,
    date,
    time,
    address,
    notes,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
}));

// 📌 @route   GET /api/orders
// 📌 @desc    Get all orders of current user
// 📌 @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('service');
  res.json(orders);
}));

// 📌 @route   GET /api/orders/:id
// 📌 @desc    Get single order by ID
// 📌 @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('service');

  if (!order) {
    res.status(404);
    throw new Error('Commande non trouvée');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Non autorisé à voir cette commande');
  }

  res.json(order);
}));
// 📌 @route   DELETE /api/orders/:id
// 📌 @desc    Delete an order
// 📌 @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Commande non trouvée');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Non autorisé à supprimer cette commande');
  }

  await order.remove();
  res.json({ message: 'Commande supprimée' });
}));

module.exports = router;