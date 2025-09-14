const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links this to the User model
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Plan', // Links this to the Plan model
    },
    razorpaySubscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      // enum: ['created', 'active', 'pending', 'halted', 'cancelled', 'completed', 'expired', 'failed'],
      // default: 'created',
      enum: ['active', 'cancelled', 'past_due', 'suspended'],
      default: 'active',
    },
    current_start: { type: Date },
    current_end: { type: Date },
    charge_at: { type: Date }, // Next billing date
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
