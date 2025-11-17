const express = require('express');
const router = express.Router();

// Mock data storage
let champions = [
  {
    id: 1,
    userId: 'user1',
    name: "Rajesh Kumar",
    area: "Sector 15, Noida", 
    role: "Area Monitoring Head",
    certificationLevel: "Advanced",
    reportsSubmitted: 45,
    issuesResolved: 38,
    contact: "+91-9876543210",
    joinedAt: new Date('2023-06-01')
  }
];

let monitoringReports = [
  {
    id: 1,
    championId: 1,
    area: "Sector 15, Block A",
    category: "waste_generation",
    issue: "Source segregation not followed",
    severity: "high", 
    status: "resolved",
    reportedAt: new Date(Date.now() - 86400000),
    resolvedAt: new Date(),
    evidenceCount: 3,
    geoLocation: { lat: 28.5355, lng: 77.3910 }
  }
];

// @route   GET /api/green-champions
// @desc    Get all active green champions
// @access  Public
router.get('/', (req, res) => {
  res.json({ success: true, champions });
});

// @route   GET /api/green-champions/status/:userId
// @desc    Check if user is a green champion
// @access  Public
router.get('/status/:userId', (req, res) => {
  const { userId } = req.params;
  const isChampion = champions.some(c => c.userId === userId);
  
  res.json({ success: true, isChampion });
});

// @route   POST /api/green-champions/apply
// @desc    Apply to become a green champion
// @access  Public
router.post('/apply', (req, res) => {
  const { userId, name, area, experience } = req.body;
  
  // In production, this would create an application for review
  const application = {
    userId,
    name,
    area,
    experience,
    status: 'pending_review',
    appliedAt: new Date()
  };
  
  res.json({ success: true, application });
});

// @route   GET /api/monitoring-reports
// @desc    Get all monitoring reports
// @access  Public
router.get('/reports', (req, res) => {
  res.json({ success: true, reports: monitoringReports });
});

// @route   POST /api/monitoring-reports
// @desc    Submit new monitoring report
// @access  Public
router.post('/reports', (req, res) => {
  const { championId, area, category, issue, severity, geoLocation } = req.body;
  
  const report = {
    id: monitoringReports.length + 1,
    championId,
    area,
    category,
    issue,
    severity,
    status: 'pending',
    reportedAt: new Date(),
    geoLocation,
    evidenceCount: 0
  };
  
  monitoringReports.unshift(report);
  
  res.json({ success: true, report });
});

module.exports = router;