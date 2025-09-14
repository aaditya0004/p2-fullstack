/* // We no longer need to import Razorpay
const Plan = require('../models/planModel');
const User = require('../models/userModel');
const Subscription = require('../models/subscriptionModel');
const crypto = require('crypto'); // Using a built-in Node.js library to create random IDs
import Invoice from '../models/invoiceModel.js';

// @desc    Create a new subscription using a dummy processor
// @route   POST /api/subscriptions
// @access  Private (we will protect this route soon)
const createSubscription = async (req, res) => {
  const { planId, userId } = req.body;

  try {
    const plan = await Plan.findById(planId);
    const user = await User.findById(userId);

    if (!plan || !user) {
      return res.status(404).json({ message: 'Plan or User not found' });
    }

    // --- DUMMY PAYMENT GATEWAY LOGIC ---
    // 1. Simulate creating a subscription ID, just like a real gateway would.
    const fakeSubscriptionId = `sub_${crypto.randomBytes(12).toString('hex')}`;
    console.log(`Simulating payment for user ${userId} with fake ID: ${fakeSubscriptionId}`);
    // ------------------------------------

    // 2. Save the "successful" subscription details to our database
    const ourSubscription = await Subscription.create({
      user: user._id,
      plan: plan._id,
      razorpaySubscriptionId: fakeSubscriptionId, // We still use the same field name
      status: 'active', // We can immediately set it to active since it's a simulation
    });

    res.status(201).json(ourSubscription); // Send back the subscription details from our database

  } catch (error) {
    console.error('Subscription Creation Error:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const getSubscriptionsByUser = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.params.userId }).populate(
      'plan',
      'name module price' // Specify which fields from the plan you want to include
    );

    if (!subscriptions) {
      return res.status(404).json({ message: 'No subscriptions found for this user' });
    }

    res.json(subscriptions);
  } catch (error) {
    console.error('Get Subscriptions Error:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  createSubscription,
  getSubscriptionsByUser, 
};

 */



const Subscription = require('../models/subscriptionModel.js');
const Plan = require('../models/planModel.js');
const User = require('../models/userModel.js');
const Invoice = require('../models/invoiceModel.js'); // Import the new Invoice model
const crypto = require('crypto');


// @desc    Create a new subscription
// @route   POST /api/subscriptions
// @access  Private (to be implemented)
const createSubscription = async (req, res) => {
  const { planId, userId } = req.body;

  try {
    const plan = await Plan.findById(planId);
    const user = await User.findById(userId);

    if (!plan || !user) {
      return res.status(404).json({ message: 'Plan or User not found' });
    }

    // --- SIMULATED PAYMENT GATEWAY LOGIC ---
    const razorpaySubscriptionId = `sub_${Math.random().toString(36).substr(2, 9)}`;
    const status = 'active'; // Assume payment is successful instantly
    // --- END SIMULATION ---
    
    const newSubscription = new Subscription({
      user: userId,
      plan: planId,
      razorpaySubscriptionId,
      status,
    });

    const savedSubscription = await newSubscription.save();

    // --- INVOICE GENERATION ---
    // After saving the subscription, create an invoice for it.
    const newInvoice = new Invoice({
        user: userId,
        subscription: savedSubscription._id,
        amount: plan.price,
        status: 'paid', // Since payment is instant in our simulation
        lineItems: [{
            description: `${plan.name} (${plan.module})`,
            amount: plan.price
        }]
    });
    await newInvoice.save();
    // --- END INVOICE GENERATION ---


    res.status(201).json(savedSubscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all subscriptions for a user
// @route   GET /api/subscriptions/:userId
// @access  Private (to be implemented)
const getUserSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ user: req.params.userId }).populate('plan');
        if (!subscriptions) {
            return res.status(404).json({ message: 'No subscriptions found for this user.' });
        }
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Cancel a user's subscription
// @route   PUT /api/subscriptions/:id/cancel
// @access  Private
const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Security Check: Ensure the user cancelling the subscription is the one who owns it
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    subscription.status = 'cancelled';
    const updatedSubscription = await subscription.save();
    
    res.json(updatedSubscription);

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Simulate a failed payment for a subscription
// @route   POST /api/subscriptions/:id/simulate-failure
// @access  Private
const simulatePaymentFailure = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate('plan');
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // 1. Set subscription status to past_due
    subscription.status = 'past_due';
    await subscription.save();

    // 2. Create a new "unpaid" invoice for this failed cycle
    const newInvoice = new Invoice({
        user: req.user._id,
        subscription: subscription._id,
        amount: subscription.plan.price,
        status: 'unpaid',
        lineItems: [{
            description: `${subscription.plan.name} (Renewal)`,
            amount: subscription.plan.price
        }],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Due in 14 days
    });
    await newInvoice.save();

    res.json({ 
        message: 'Simulated payment failure successfully', 
        subscription,
        newInvoice 
    });

  } catch (error) {
    console.error('Error simulating payment failure:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = { createSubscription, getUserSubscriptions, cancelSubscription, simulatePaymentFailure, };

