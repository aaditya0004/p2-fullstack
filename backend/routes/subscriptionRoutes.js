const express = require('express');
const router = express.Router();
const { createSubscription, getUserSubscriptions, cancelSubscription, simulatePaymentFailure, } = require('../controllers/subscriptionController.js');
const { protect } = require('../middleware/authMiddleware.js');

// POST /api/subscriptions - Create a new subscription
router.post('/', createSubscription);
router.get('/:userId', protect, getUserSubscriptions);
router.put('/:id/cancel', protect, cancelSubscription);
router.post('/:id/failure', protect, simulatePaymentFailure);

module.exports = router;
