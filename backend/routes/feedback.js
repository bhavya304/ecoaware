const express = require('express');
const router = express.Router();

// Mock feedback database
let feedbacks = [];

// @route   POST /api/feedback
// @desc    Submit worker feedback about citizens
// @access  Public (should be authenticated workers only)
router.post('/', (req, res) => {
  try {
    const { 
      workerId, 
      location, 
      issueType, 
      description, 
      severity, 
      anonymous 
    } = req.body;
    
    // Validation
    if (!issueType || !description) {
      return res.status(400).json({ message: 'Issue type and description are required' });
    }
    
    const feedback = {
      id: feedbacks.length + 1,
      workerId: anonymous ? null : workerId,
      location: location || '',
      issueType,
      description,
      severity: severity || 'medium',
      anonymous: anonymous || false,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    feedbacks.push(feedback);
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedbackId: feedback.id
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/feedback
// @desc    Get feedback submissions (for admins)
// @access  Public (should be admin only)
router.get('/', (req, res) => {
  try {
    const { status, workerId, issueType } = req.query;
    
    let filteredFeedback = [...feedbacks];
    
    if (status) {
      filteredFeedback = filteredFeedback.filter(f => f.status === status);
    }
    
    if (workerId) {
      filteredFeedback = filteredFeedback.filter(f => f.workerId === workerId);
    }
    
    if (issueType) {
      filteredFeedback = filteredFeedback.filter(f => f.issueType === issueType);
    }
    
    res.json({
      success: true,
      count: filteredFeedback.length,
      feedback: filteredFeedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;