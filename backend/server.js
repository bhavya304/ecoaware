const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------- MIDDLEWARE ----------------------
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.set('trust proxy', 1); // trust first proxy
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------------- ROUTES ----------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/products', require('./routes/products'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/points', require('./routes/points'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/mandatory-training', require('./routes/mandatory-training'));
app.use('/api/green-champions', require('./routes/green-champions'));
app.use('/api/waste-tracking', require('./routes/waste-tracking'));
app.use('/api/incentives', require('./routes/incentives'));
app.use('/api/waste-facilities', require('./routes/waste-facilities'));
app.use('/api/monitoring-reports', require('./routes/green-champions'));
app.use('/api/composting', require('./routes/composting')); // ✅ NEW Composting Route

// ---------------------- HEALTH CHECK ----------------------
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ---------------------- DEFAULT ROUTES ----------------------
app.get("/", (req, res) => {
  res.send({
    message: "🌱 Welcome to EcoAware Backend",
    availableRoutes: [
      "/api/auth",
      "/api/upload",
      "/api/products",
      "/api/vendors",
      "/api/locations",
      "/api/feedback",
      "/api/points",
      "/api/workers",
      "/api/mandatory-training",
      "/api/green-champions",
      "/api/waste-tracking",
      "/api/incentives",
      "/api/waste-facilities",
      "/api/composting", // ✅ Listed in default routes
      "/api/health"
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ---------------------- ERROR HANDLING ----------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ---------------------- START SERVER ----------------------
app.listen(PORT, () => {
  console.log(`🌱 EcoAware Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
