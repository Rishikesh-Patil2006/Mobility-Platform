const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

// Health Check Route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Roadmate backend is running',
    database: 'connected', // Ideally check DB connection here
    timestamp: new Date().toISOString()
  });
});

// Placeholder Auth Route
router.get('/auth/me', authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;
