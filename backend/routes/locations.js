const express = require('express');
const router = express.Router();

// Mock locations database (in production, use proper database)
const locations = [
  // Recycling
  { id: 1, name: "Central Park Recycling Bin", type: "recycling", lat: 17.3850, lng: 78.4867, address: "Central Park, Hyderabad", description: "General recyclable materials accepted", verified: true, addedBy: "admin" },
  { id: 2, name: "Madhapur Recycling Hub", type: "recycling", lat: 17.4483, lng: 78.3915, address: "Madhapur, Hyderabad", description: "Plastic bottles, cans, and e-waste accepted", verified: false, addedBy: "worker2" },

  // Compost
  { id: 3, name: "Community Compost Center", type: "compost", lat: 17.4435, lng: 78.3772, address: "Gachibowli, Hyderabad", description: "Organic waste composting facility", verified: true, addedBy: "admin" },
  { id: 4, name: "EcoGarden Compost Site", type: "compost", lat: 17.4000, lng: 78.4800, address: "Secunderabad", description: "Accepts garden clippings and kitchen waste", verified: false, addedBy: "citizen2" },

  // Hazardous
  { id: 5, name: "Hazardous Waste Collection", type: "hazardous", lat: 17.3616, lng: 78.4747, address: "Industrial Area, Hyderabad", description: "Battery, electronic, and chemical waste", verified: false, addedBy: "worker1" },
  { id: 6, name: "E-Waste Drop Point", type: "hazardous", lat: 17.4200, lng: 78.5000, address: "Kukatpally, Hyderabad", description: "Accepts e-waste and CFL bulbs", verified: true, addedBy: "admin" },

  // Pickup
  { id: 7, name: "Mobile Pickup Point", type: "pickup", lat: 17.4126, lng: 78.4514, address: "Banjara Hills, Hyderabad", description: "Weekly pickup service available", verified: true, addedBy: "citizen1" },
  { id: 8, name: "Residential Pickup Spot", type: "pickup", lat: 17.4500, lng: 78.3800, address: "Ameerpet, Hyderabad", description: "Door-to-door pickup every Sunday", verified: false, addedBy: "worker3" }
];

// @route   GET /api/locations
// @desc    Get all recycling/waste locations
// @access  Public
router.get('/', (req, res) => {
  try {
    const { type, verified } = req.query;

    let filteredLocations = [...locations];

    if (type) {
      filteredLocations = filteredLocations.filter(loc => loc.type === type);
    }

    if (verified !== undefined) {
      filteredLocations = filteredLocations.filter(loc =>
        loc.verified === (verified === 'true')
      );
    }

    res.json({
      success: true,
      count: filteredLocations.length,
      locations: filteredLocations
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/locations
// @desc    Add new recycling/waste location
// @access  Public (in production, should be authenticated)
router.post('/', (req, res) => {
  try {
    const { name, type, lat, lng, address, description, userId } = req.body;

    // Validation
    if (!name || !type || !lat || !lng) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    if (!['recycling', 'compost', 'hazardous', 'pickup'].includes(type)) {
      return res.status(400).json({ message: 'Invalid location type' });
    }

    const newLocation = {
      id: locations.length + 1,
      name,
      type,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address: address || '',
      description: description || '',
      verified: false, // New locations need verification
      addedBy: userId || 'anonymous',
      createdAt: new Date()
    };

    locations.push(newLocation);

    res.status(201).json({
      success: true,
      message: 'Location added successfully',
      location: newLocation
    });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;