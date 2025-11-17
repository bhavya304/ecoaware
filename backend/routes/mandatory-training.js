const express = require('express');
const router = express.Router();

// Mock training progress storage
let trainingProgress = {};
let certifications = {};

// @route   GET /api/mandatory-training/modules
// @desc    Get all mandatory training modules
// @access  Public
router.get('/modules', (req, res) => {
  const modules = [
    {
      id: 1,
      title: "Waste Segregation at Source",
      description: "Learn proper waste segregation techniques",
      mandatory: true,
      duration: "30 minutes",
      steps: 3
    },
    {
      id: 2,
      title: "Home Composting Techniques", 
      description: "Master the art of converting organic waste into compost",
      mandatory: true,
      duration: "45 minutes",
      steps: 2
    },
    {
      id: 3,
      title: "Plastic Reuse and Recycling",
      description: "Learn creative ways to reuse plastic items",
      mandatory: true,
      duration: "25 minutes", 
      steps: 2
    },
    {
      id: 4,
      title: "Hazardous Waste Management",
      description: "Safe handling and disposal of domestic hazardous materials",
      mandatory: true,
      duration: "35 minutes",
      steps: 2
    }
  ];
  
  res.json({ success: true, modules });
});

// @route   POST /api/mandatory-training/progress
// @desc    Update training progress
// @access  Public
router.post('/progress', (req, res) => {
  const { userId, moduleId, stepCompleted, score } = req.body;
  
  if (!trainingProgress[userId]) {
    trainingProgress[userId] = {};
  }
  
  trainingProgress[userId][moduleId] = {
    completed: stepCompleted,
    score: score || 0,
    completedAt: new Date()
  };
  
  res.json({ success: true, progress: trainingProgress[userId] });
});

// @route   GET /api/mandatory-training/progress/:userId
// @desc    Get user's training progress
// @access  Public
router.get('/progress/:userId', (req, res) => {
  const { userId } = req.params;
  const progress = trainingProgress[userId] || {};
  
  res.json({ success: true, progress });
});

// @route   POST /api/citizen/certification
// @desc    Issue certification for completed training
// @access  Public
router.post('/certification', (req, res) => {
  const { userId, type } = req.body;
  
  const certificateId = `WM-${userId}-${Date.now()}`;
  certifications[userId] = {
    type,
    certificateId,
    issuedAt: new Date(),
    status: 'active'
  };
  
  res.json({ 
    success: true, 
    certification: certifications[userId] 
  });
});

// @route   GET /api/citizen/certification/:userId
// @desc    Get user's certification status
// @access  Public
router.get('/certification/:userId', (req, res) => {
  const { userId } = req.params;
  const certification = certifications[userId] || null;
  
  res.json({ success: true, certification });
});

module.exports = router;