const Plan = require('../models/planModel.js');

// @desc    Create a new subscription plan
// @route   POST /api/plans
// @access  Private/Admin (we will add auth later)
const createPlan = async (req, res) => {
  const { name, module, price, billingCycle, features } = req.body;

  try {
    const planExists = await Plan.findOne({ name });

    if (planExists) {
      return res.status(400).json({ message: 'Plan with this name already exists' });
    }

    const plan = await Plan.create({
      name,
      module,
      price,
      billingCycle,
      features,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all subscription plans
// @route   GET /api/plans
// @access  Public
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  createPlan,
  getPlans,
};
