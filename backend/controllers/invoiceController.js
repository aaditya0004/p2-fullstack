const Invoice = require('../models/invoiceModel.js');
const Subscription = require('../models/subscriptionModel.js');

// @desc    Get all invoices for a user
// @route   GET /api/invoices/:userId
// @access  Private (to be implemented)
const getUserInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.params.userId }).sort({ invoiceDate: -1 }); // Sort by newest first
    if (!invoices) {
      return res.status(404).json({ message: 'No invoices found for this user.' });
    }
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Simulate a user paying an unpaid invoice
// @route   POST /api/invoices/:id/pay
// @access  Private
const simulateInvoicePayment = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        if (invoice.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        if(invoice.status !== 'unpaid') {
            return res.status(400).json({ message: 'Invoice is not awaiting payment' });
        }

        // 1. Mark the invoice as paid
        invoice.status = 'paid';
        await invoice.save();

        // 2. Find the associated subscription and set it back to active
        const subscription = await Subscription.findById(invoice.subscription);
        if (subscription) {
            subscription.status = 'active';
            await subscription.save();
        }

        res.json({ message: 'Invoice paid successfully', invoice, subscription });

    } catch (error) {
        console.error('Error simulating invoice payment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getUserInvoices, simulateInvoicePayment, };