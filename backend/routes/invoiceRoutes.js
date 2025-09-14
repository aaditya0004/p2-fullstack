const express = require('express');
const router = express.Router();
const { getUserInvoices, simulateInvoicePayment, } = require('../controllers/invoiceController.js');
const { protect } = require('../middleware/authMiddleware.js');

// This route will handle GET requests to /api/invoices/:userId
router.get('/:userId', protect, getUserInvoices);
router.post('/:id/pay', protect, simulateInvoicePayment);

module.exports = router; 
