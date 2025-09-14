const express = require('express');
const router = express.Router();
const { createPlan, getPlans } = require('../controllers/planController.js');

// POST /api/plans - Create a new plan
router.post('/', createPlan);

// GET /api/plans - Get all plans
router.get('/', getPlans);

module.exports = router;
