const express = require('express');
const router = express.Router();

// Mock worker health data
let healthData = {
  'worker1': []
};

// @route   POST /api/workers/health
// @desc    Add health tracking entry for worker
// @access  Public (should be authenticated workers only)
router.post('/health', (req, res) => {
  try {
    const { workerId, hoursWorked, waterBreaks, symptoms, notes } = req.body;
    
    if (!workerId) {
      return res.status(400).json({ message: 'Worker ID is required' });
    }
    
    // Initialize worker if doesn't exist
    if (!healthData[workerId]) {
      healthData[workerId] = [];
    }
    
    const healthEntry = {
      id: healthData[workerId].length + 1,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      hoursWorked: parseFloat(hoursWorked) || 0,
      waterBreaks: parseInt(waterBreaks) || 0,
      symptoms: symptoms || '',
      notes: notes || '',
      timestamp: new Date()
    };
    
    healthData[workerId].unshift(healthEntry); // Add to beginning
    
    res.status(201).json({
      success: true,
      message: 'Health entry recorded successfully',
      entry: healthEntry
    });
  } catch (error) {
    console.error('Error recording health data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/workers/health/:workerId
// @desc    Get worker's health history
// @access  Public (should be authenticated)
router.get('/health/:workerId', (req, res) => {
  try {
    const { workerId } = req.params;
    const { days } = req.query;
    
    if (!healthData[workerId]) {
      return res.json({
        success: true,
        count: 0,
        entries: []
      });
    }
    
    let entries = healthData[workerId];
    
    // Filter by days if specified
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      entries = entries.filter(entry => new Date(entry.timestamp) >= daysAgo);
    }
    
    res.json({
      success: true,
      count: entries.length,
      entries
    });
  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/workers/stats/:workerId
// @desc    Get worker performance statistics
// @access  Public (should be authenticated)
router.get('/stats/:workerId', (req, res) => {
  try {
    const { workerId } = req.params;
    
    // Mock statistics (in production, calculate from real data)
    const stats = {
      workerId,
      trainingProgress: 85,
      totalSegregations: 127,
      correctSegregations: 118,
      hazardousDetected: 3,
      hoursThisMonth: 156,
      performanceGrade: 'A+',
      weeklyAverage: {
        hoursWorked: 32,
        waterBreaks: 14,
        accuracy: 92.9
      }
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching worker stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;