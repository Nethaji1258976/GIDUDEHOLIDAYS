const express = require('express');
const router  = express.Router();
const { isUserAuthenticated } = require('../middleware/auth');
const Package = require('../models/Package');

// ── Home ──────────────────────────────────────────────────────
router.get('/', isUserAuthenticated, async (req, res) => {
  res.render('index');
});

// ── Destinations ──────────────────────────────────────────────
router.get('/destinations', isUserAuthenticated, async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.render('destinations', { packages });
  } catch {
    res.render('destinations', { packages: [] });
  }
});

// ── Services ──────────────────────────────────────────────────
router.get('/services', isUserAuthenticated, (req, res) => res.render('services'));

// ── About ─────────────────────────────────────────────────────
router.get('/about', isUserAuthenticated, (req, res) => res.render('about'));

// ── Contact ───────────────────────────────────────────────────
router.get('/contact', isUserAuthenticated, (req, res) => res.render('contact'));

// ── B2B ───────────────────────────────────────────────────────
router.get('/b2b', isUserAuthenticated, (req, res) => res.render('b2b'));

module.exports = router;
