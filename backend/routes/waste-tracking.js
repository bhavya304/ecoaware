const express = require('express');
const router = express.Router();

// Mock vehicle tracking data
let vehicles = [
  {
    id: 'WCV001',
    vehicleNumber: 'DL-8C-1234',
    driverName: 'Ramesh Kumar',
    route: 'Sector 15-18, Noida',
    status: 'collecting',
    currentLocation: { lat: 28.5355, lng: 77.3910 },
    lastUpdated: new Date(),
    wasteCollected: 450,
    capacity: 800,
    nextPickup: 'Block B, Sector 16',
    estimatedTime: '10:30 AM'
  }
];

let wasteReports = [];

// ---------------- VEHICLE APIs ----------------

// Get all vehicles
router.get('/vehicles', (req, res) => {
  res.json({ success: true, vehicles });
});

// Get specific vehicle
router.get('/vehicle/:vehicleId', (req, res) => {
  const { vehicleId } = req.params;
  const vehicle = vehicles.find(v => v.id === vehicleId);

  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  res.json({ success: true, vehicle });
});

// 🚀 Worker updates vehicle status + GPS
router.post('/vehicles/update', (req, res) => {
  const { id, status, lat, lng } = req.body;

  if (!id || !status || !lat || !lng) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const updatedVehicle = {
    id,
    vehicleNumber: `TEMP-${id}`, // fallback if no vehicleNumber
    driverName: 'Updated Worker',
    route: 'Dynamic',
    status,
    currentLocation: { lat: parseFloat(lat), lng: parseFloat(lng) },
    lastUpdated: new Date(),
    wasteCollected: Math.floor(Math.random() * 800), // mock fill %
    capacity: 800,
    nextPickup: 'Auto-assigned',
    estimatedTime: new Date().toLocaleTimeString()
  };

  // Replace if exists, else add new
  vehicles = vehicles.filter(v => v.id !== id);
  vehicles.push(updatedVehicle);

  res.json({ success: true, vehicle: updatedVehicle });
});

// ---------------- WASTE REPORT APIs ----------------

// Submit dumping report
router.post('/reports', (req, res) => {
  const { reportedBy, description, lat, lng } = req.body;

  const report = {
    id: wasteReports.length + 1,
    reportedBy,
    description,
    geoLocation: { lat: parseFloat(lat), lng: parseFloat(lng) },
    status: 'pending',
    reportedAt: new Date(),
    imageUrl: req.file ? req.file.filename : null
  };

  wasteReports.unshift(report);

  res.json({ success: true, report });
});

// Get all waste reports
router.get('/reports', (req, res) => {
  res.json({ success: true, reports: wasteReports });
});

module.exports = router;
