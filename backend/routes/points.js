const express = require('express');
const router = express.Router();

// Mock points database
let userPoints = {
  'citizen1': { total: 156, history: [] },
  'worker1': { total: 89, history: [] }
};

// @route   POST /api/points/earn
// @desc    Award points to user for eco-friendly actions
// @access  Public (should be authenticated)
router.post('/earn', (req, res) => {
  try {
    const { userId, points, activity, description } = req.body;
    
    if (!userId || !points || !activity) {
      return res.status(400).json({ message: 'UserId, points, and activity are required' });
    }
    
    const pointsToAdd = parseInt(points);
    if (pointsToAdd <= 0) {
      return res.status(400).json({ message: 'Points must be positive' });
    }
    
    // Initialize user if doesn't exist
    if (!userPoints[userId]) {
      userPoints[userId] = { total: 0, history: [] };
    }
    
    // Add points
    userPoints[userId].total += pointsToAdd;
    
    // Add to history
    const historyEntry = {
      id: userPoints[userId].history.length + 1,
      points: pointsToAdd,
      activity,
      description: description || '',
      timestamp: new Date()
    };
    
    userPoints[userId].history.unshift(historyEntry); // Add to beginning
    
    res.json({
      success: true,
      message: `${pointsToAdd} points awarded`,
      totalPoints: userPoints[userId].total,
      pointsEarned: pointsToAdd
    });
  } catch (error) {
    console.error('Error awarding points:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/points/:userId
// @desc    Get user's points and history
// @access  Public (should be authenticated)
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    if (!userPoints[userId]) {
      return res.json({
        success: true,
        totalPoints: 0,
        history: []
      });
    }
    
    let history = userPoints[userId].history;
    if (limit) {
      history = history.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      totalPoints: userPoints[userId].total,
      history
    });
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;