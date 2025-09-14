const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Subscription',
    },
    amount: { // The total amount in cents
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['paid', 'pending', 'failed', 'unpaid'],
      default: 'paid',
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
        type: Date,
        default: Date.now, // For instant payments, due date is the same as invoice date
    },
    lineItems: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
