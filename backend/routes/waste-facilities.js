const express = require('express');
const router = express.Router();

// Mock waste management facilities data
const facilities = [
  {
    id: 1,
    name: "Okhla Waste-to-Energy Plant",
    type: "waste_to_energy",
    location: "Okhla, New Delhi",
    capacity: "2000 TPD",
    currentLoad: "1650 TPD", 
    efficiency: "82.5%",
    powerGenerated: "16 MW",
    status: "operational",
    coordinates: { lat: 28.5355, lng: 77.3910 }
  },
  {
    id: 2,
    name: "Delhi Composting Facility",
    type: "composting", 
    location: "Narela, Delhi",
    capacity: "500 TPD",
    currentLoad: "420 TPD",
    efficiency: "84%",
    compostProduced: "150 TPD",
    status: "operational",
    coordinates: { lat: 28.8955, lng: 77.1025 }
  }
];

// @route   GET /api/waste-facilities
// @desc    Get all waste management facilities
// @access  Public
router.get('/', (req, res) => {
  const { type, location } = req.query;
  
  let filteredFacilities = facilities;
  
  if (type) {
    filteredFacilities = filteredFacilities.filter(f => f.type === type);
  }
  
  if (location) {
    filteredFacilities = filteredFacilities.filter(f => 
      f.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  res.json({ success: true, facilities: filteredFacilities });
});

// @route   GET /api/waste-facilities/:id
// @desc    Get specific facility details
// @access  Public
router.get('/:id', (req, res) => {
  const facility = facilities.find(f => f.id === parseInt(req.params.id));
  
  if (!facility) {
    return res.status(404).json({ message: 'Facility not found' });
  }
  
  res.json({ success: true, facility });
});

// @route   GET /api/waste-facilities/stats/daily
// @desc    Get daily waste processing statistics
// @access  Public
router.get('/stats/daily', (req, res) => {
  const stats = {
    totalCollected: 1650,
    totalTreated: 1420,
    sentToLandfill: 230,
    treatmentRate: 86,
    breakdown: {
      wasteToEnergy: 850,
      composting: 380,
      recycling: 190,
      landfill: 230
    }
  };
  
  res.json({ success: true, stats });
});

module.exports = router;