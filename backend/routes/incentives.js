const express = require('express');
const router = express.Router();

// Mock incentive data
let incentivePrograms = [
  {
    id: 1,
    type: 'bulk_waste_generator',
    title: 'Bulk Waste Generator Incentive',
    description: 'Monthly incentive for proper source segregation',
    eligibility: 'Commercial buildings generating >100kg/day',
    incentiveAmount: '₹5,000 - ₹25,000',
    participants: 145,
    totalPayout: '₹18,50,000'
  }
];

let userEarnings = {};
let buildingCompliance = [];
let penalizations = [];

// @route   GET /api/incentives
// @desc    Get all incentive programs
// @access  Public
router.get('/', (req, res) => {
  const { period = 'monthly' } = req.query;
  
  res.json({ 
    success: true, 
    incentives: incentivePrograms,
    period 
  });
});

// @route   GET /api/user-incentives/:userId
// @desc    Get user's incentive earnings
// @access  Public
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const earnings = userEarnings[userId] || {
    totalEarned: 0,
    currentMonth: 0,
    rank: 'Bronze',
    level: 1,
    recentEarnings: []
  };
  
  res.json({ success: true, earnings });
});

// @route   POST /api/user-incentives/:userId/earn
// @desc    Record incentive earning for user
// @access  Public
router.post('/user/:userId/earn', (req, res) => {
  const { userId } = req.params;
  const { amount, type, description } = req.body;
  
  if (!userEarnings[userId]) {
    userEarnings[userId] = {
      totalEarned: 0,
      currentMonth: 0,
      rank: 'Bronze',
      level: 1,
      recentEarnings: []
    };
  }
  
  userEarnings[userId].totalEarned += amount;
  userEarnings[userId].currentMonth += amount;
  
  const earning = {
    date: new Date(),
    amount,
    type,
    description
  };
  
  userEarnings[userId].recentEarnings.unshift(earning);
  
  res.json({ success: true, earnings: userEarnings[userId] });
});

// @route   GET /api/building-compliance
// @desc    Get building compliance scores
// @access  Public
router.get('/compliance', (req, res) => {
  res.json({ success: true, buildings: buildingCompliance });
});

// @route   GET /api/penalizations
// @desc    Get active penalizations
// @access  Public
router.get('/penalties', (req, res) => {
  res.json({ success: true, penalizations });
});

module.exports = router;