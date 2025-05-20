const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');

// 🧪 Exemple : Stripe ou autre service de paiement (à adapter selon ton intégration)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 📌 @route   POST /api/payment/checkout
// 📌 @desc    Create a Stripe Checkout session
// 📌 @access  Private
router.post('/checkout', protect, asyncHandler(async (req, res) => {
  const { amount, currency, successUrl, cancelUrl } = req.body;

  if (!amount || !currency || !successUrl || !cancelUrl) {
    res.status(400);
    throw new Error('Tous les champs sont requis');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: 'Paiement de service',
          },
          unit_amount: amount * 100, // Stripe attend un montant en centimes
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: req.user.email,
  });

  res.status(201).json({ id: session.id });
}));

module.exports = router;
