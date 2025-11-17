const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Mock user database (in production, use real database)
const mockUsers = [
  {
    id: 'citizen1',
    username: 'citizen1',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMye1CMBYGlYE9lPsLPZjl7AwmP9F6YS.Pm', // password123
    mode: 'citizen',
    email: 'citizen1@example.com'
  },
  {
    id: 'worker1', 
    username: 'worker1',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMye1CMBYGlYE9lPsLPZjl7AwmP9F6YS.Pm', // password123
    mode: 'worker',
    email: 'worker1@example.com'
  }
];

// @route   POST /api/auth/login
// @desc    Authenticate user and return JWT token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password, mode } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user (in production, query database)
    const user = mockUsers.find(u => 
      u.username === username && (!mode || u.mode === mode)
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password (in production, use bcrypt.compare)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        mode: user.mode
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        mode: user.mode,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, password, mode, email } = req.body;

    // Validate input
    if (!username || !password || !mode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['citizen', 'worker'].includes(mode)) {
      return res.status(400).json({ message: 'Invalid mode' });
    }

    // Check if user exists
    const existingUser = mockUsers.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: `${mode}_${Date.now()}`,
      username,
      password: hashedPassword,
      mode,
      email: email || `${username}@example.com`,
      createdAt: new Date()
    };

    mockUsers.push(newUser);

    // Generate JWT token
    const payload = {
      user: {
        id: newUser.id,
        username: newUser.username,
        mode: newUser.mode
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        mode: newUser.mode,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.get('/verify', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    res.json({ success: true, user: decoded.user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;