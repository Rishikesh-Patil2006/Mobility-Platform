const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const servicesRouter = require('./services');
const vendorsRouter = require('./vendors');
const adminRouter = require('./admin');

// ── HEALTH CHECK ROUTE ──
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Roadmate backend is running',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// ── BIND CHILD ROUTERS ──
router.use('/auth', authRouter);
router.use('/services', servicesRouter);
router.use('/vendors', vendorsRouter);
router.use('/admin', adminRouter);

module.exports = router;
