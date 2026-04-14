const express = require('express');
const router  = express.Router();
const { Contact, Agent } = require('../models');

// ── Contact / Quote Enquiry ───────────────────────────────────
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message)
      return res.json({ success: false, message: 'Name, email and message are required.' });

    await Contact.create({ name, email, phone, subject, message });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ── B2B Agent Registration ────────────────────────────────────
router.post('/agent', async (req, res) => {
  try {
    const { agencyName, contactPerson, mobile, email } = req.body;
    if (!agencyName || !contactPerson || !mobile || !email)
      return res.json({ success: false, message: 'Please fill all required fields.' });

    await Agent.create(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Server error. Please try again.' });
  }
});

module.exports = router;
