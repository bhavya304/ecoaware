const express = require('express');
const router = express.Router();

// Mock vendors database
// Mock vendors database
const vendors = [
  {
    id: 1,
    name: "Green Earth Store",
    category: "General",
    description: "Eco-friendly products for everyday use",
    rating: 4.8,
    discount: "15% off for EcoAware users",
    image: "🌍",
    location: "Downtown",
    contact: "contact@greenearth.com",
    website: "www.greenearth.com",
    products: ["Bamboo Toothbrushes", "Reusable Bags", "Solar Chargers"],
    verified: true
  },
  {
    id: 2,
    name: "Zero Waste Co.",
    category: "Zero Waste",
    description: "Complete zero-waste lifestyle solutions",
    rating: 4.9,
    discount: "20% off bulk orders",
    image: "♻️",
    location: "City Center",
    contact: "hello@zerowaste.co",
    website: "www.zerowaste.co",
    products: ["Compost Bins", "Reusable Containers", "Organic Cleaners"],
    verified: true
  },
  {
    id: 3,
    name: "Bamboo Basics",
    category: "Bamboo Products",
    description: "Premium bamboo products for sustainable living",
    rating: 4.7,
    discount: "10% off first purchase",
    image: "🎋",
    location: "Mall Road",
    contact: "info@bamboobasics.com",
    website: "www.bamboobasics.com",
    products: ["Bamboo Cutlery", "Bamboo Bottles", "Bamboo Fiber Clothes"],
    verified: false
  },
  {
    id: 4,
    name: "Solar Solutions",
    category: "Renewable Energy",
    description: "Solar panels and renewable energy systems",
    rating: 4.6,
    discount: "Free consultation",
    image: "☀️",
    location: "Industrial Area",
    contact: "support@solarsolutions.in",
    website: "www.solarsolutions.in",
    products: ["Solar Panels", "Solar Lights", "Power Banks"],
    verified: true
  },
  {
    id: 5,
    name: "Organic Garden",
    category: "Organic Food",
    description: "Fresh organic produce and gardening supplies",
    rating: 4.5,
    discount: "Free delivery on ₹500+",
    image: "🥬",
    location: "Farm House",
    contact: "orders@organicgarden.in",
    website: "www.organicgarden.in",
    products: ["Organic Vegetables", "Seeds", "Fertilizers"],
    verified: true
  },
  {
    id: 6,
    name: "EcoFashion Hub",
    category: "Clothing",
    description: "Sustainable and ethical fashion brands",
    rating: 4.4,
    discount: "25% off seasonal sale",
    image: "👕",
    location: "Fashion Street",
    contact: "style@ecofashion.com",
    website: "www.ecofashion.com",
    products: ["Organic Cotton Wear", "Recycled Fabric", "Hemp Clothing"],
    verified: false
  }
];


// @route   GET /api/vendors
// @desc    Get all eco-friendly vendors
// @access  Public
router.get('/', (req, res) => {
  try {
    const { category, verified, location } = req.query;
    
    let filteredVendors = [...vendors];
    
    if (category && category !== 'all') {
      filteredVendors = filteredVendors.filter(v => 
        v.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (verified === 'true') {
      filteredVendors = filteredVendors.filter(v => v.verified);
    }
    
    if (location) {
      filteredVendors = filteredVendors.filter(v => 
        v.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      count: filteredVendors.length,
      vendors: filteredVendors
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;