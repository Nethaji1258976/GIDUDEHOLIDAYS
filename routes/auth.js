const express = require('express');
const router  = express.Router();
const { User } = require('../models');

// ── Register ──────────────────────────────────────────────────
router.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('auth-register');
});

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !password)
      return res.render('auth-register', { error: 'Please fill all required fields.' });
    if (password.length < 6)
      return res.render('auth-register', { error: 'Password must be at least 6 characters.' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.render('auth-register', { error: 'An account with this email already exists.' });

    const user = await User.create({ fullName, email, phone, password });
    req.session.userId = user._id;
    req.session.user   = { fullName: user.fullName, email: user.email };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('auth-register', { error: 'Registration failed. Please try again.' });
  }
});

// ── Login ─────────────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('auth-login');
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password)))
      return res.render('auth-login', { error: 'Invalid email or password.' });
    if (!user.isActive)
      return res.render('auth-login', { error: 'Your account has been disabled. Contact admin.' });

    req.session.userId = user._id;
    req.session.user   = { fullName: user.fullName, email: user.email };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('auth-login', { error: 'Login failed. Please try again.' });
  }
});

// ── Logout ────────────────────────────────────────────────────
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
