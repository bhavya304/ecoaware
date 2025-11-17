const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, .png files are allowed'));
    }
  }
});

// Helper: safe file cleanup
function safeCleanup(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, err => {
      if (err) console.error('Cleanup failed:', err.message);
    });
  }
}

// @route   POST /api/upload/product-photo
router.post('/product-photo', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { userId } = req.body;
    console.log(`Processing image upload for user: ${userId}`);

    const formData = new FormData();
    const imageBuffer = fs.readFileSync(req.file.path);
    formData.append('image', imageBuffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('userId', userId || 'anonymous');

    try {
      const aiApiUrl = process.env.AI_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${aiApiUrl}/ai/analyze-image`, formData, {
        headers: formData.getHeaders(),
        timeout: 30000
      });

      res.json({
        success: true,
        filename: req.file.filename,
        ...response.data
      });

    } catch (aiError) {
      console.error('AI analysis failed:', aiError.message);

      res.json({
        success: true,
        filename: req.file.filename,
        ...generateMockAnalysis(req.file.originalname),
        note: 'Using mock analysis - AI service unavailable'
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  } finally {
    safeCleanup(req.file?.path);
  }
});

// @route   POST /api/upload/waste-photo
router.post('/waste-photo', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { userId, workerId } = req.body;

    const formData = new FormData();
    const imageBuffer = fs.readFileSync(req.file.path);
    formData.append('image', imageBuffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('workerId', workerId || userId || 'anonymous');

    try {
      const aiApiUrl = process.env.AI_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${aiApiUrl}/ai/check-segregation`, formData, {
        headers: formData.getHeaders(),
        timeout: 30000
      });

      res.json({
        success: true,
        filename: req.file.filename,
        ...response.data
      });

    } catch (aiError) {
      console.error('AI segregation check failed:', aiError.message);

      res.json({
        success: true,
        filename: req.file.filename,
        ...generateMockSegregation(req.file.originalname),
        note: 'Using mock analysis - AI service unavailable'
      });
    }

  } catch (error) {
    console.error('Waste upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  } finally {
    safeCleanup(req.file?.path);
  }
});

// Mock functions
function generateMockAnalysis(filename) {
  return {
    score: 7.5,
    disposal: 'Recycle',
    carbon_kg: 1.23,
    alt_products: [{ id: 1, name: 'Eco Option', score: 9.0 }],
    analysis_method: 'mock'
  };
}

function generateMockSegregation(filename) {
  return {
    segregatedCorrectly: true,
    confidence: 0.85,
    reason: 'Mock check',
    wasteTypes: ['plastic', 'organic'],
    recommendations: ['Recycle plastic', 'Compost organic']
  };
}

module.exports = router;
