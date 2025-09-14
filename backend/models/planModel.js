const mongoose = require('mongoose');

const planSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Each plan must have a unique name
    },
    // The name of the module this plan belongs to
    module: {
      type: String,
      required: true,
      enum: [
        'Cloud Security',
        'Endpoint Security',
        'Network Security',
        'Compliance',
        'VAPT',
      ],
    },
    // Price in the smallest currency unit (e.g., paise for INR, cents for USD)
    price: {
      type: Number,
      required: true,
    },
    // Billing cycle: 'monthly' or 'yearly'
    billingCycle: {
      type: String,
      required: true,
      enum: ['monthly', 'yearly'],
    },
    // Array of features included in the plan
    features: {
      type: [String],
      required: true,
    },
    // We will link this to a Razorpay Plan ID later
    razorpayPlanId: {
      type: String,
      required: false, // Not required initially
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
