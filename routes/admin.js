const express = require('express');
const router  = express.Router();
const { isAdminAuthenticated } = require('../middleware/auth');
const { User, Contact, Agent } = require('../models');
const Package = require('../models/Package');

// ── Admin Login ───────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.session.adminLoggedIn) return res.redirect('/admin');
  res.render('admin-login');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === (process.env.ADMIN_USERNAME || 'admin') &&
      password === (process.env.ADMIN_PASSWORD || 'GoDude@2024')) {
    req.session.adminLoggedIn = true;
    return res.redirect('/admin');
  }
  res.render('admin-login', { error: 'Invalid credentials.' });
});

router.get('/logout', (req, res) => {
  req.session.adminLoggedIn = false;
  res.redirect('/admin/login');
});

// ── Dashboard ─────────────────────────────────────────────────
router.get('/', isAdminAuthenticated, async (req, res) => {
  try {
    const [userCount, contactCount, agentCount, packageCount, recentContacts, recentAgents] = await Promise.all([
      User.countDocuments(),
      Contact.countDocuments(),
      Agent.countDocuments(),
      Package.countDocuments(),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      Agent.find().sort({ createdAt: -1 }).limit(5)
    ]);
    const msg = req.session.flashMsg; delete req.session.flashMsg;
    res.render('admin-dashboard', { userCount, contactCount, agentCount, packageCount, recentContacts, recentAgents, msg });
  } catch (err) {
    console.error(err);
    res.render('admin-dashboard', { userCount:0, contactCount:0, agentCount:0, packageCount:0, recentContacts:[], recentAgents:[], msg:null });
  }
});

// ══════════════════════════════════════════════════════════════
// PACKAGES
// ══════════════════════════════════════════════════════════════
router.get('/packages', isAdminAuthenticated, async (req, res) => {
  const packages = await Package.find().sort({ sortOrder:1, createdAt:-1 });
  const msg = req.session.flashMsg; delete req.session.flashMsg;
  res.render('admin-packages', { packages, msg });
});

router.get('/packages/new', isAdminAuthenticated, (req, res) => {
  res.render('admin-package-form', { pkg: null });
});

router.post('/packages/new', isAdminAuthenticated, async (req, res) => {
  try {
    const { name, destination, duration, price, priceLabel, badge, description, highlights, imageUrl, includes, isActive, sortOrder } = req.body;
    await Package.create({
      name, destination, duration,
      price: parseFloat(price) || 0,
      priceLabel, badge, description,
      highlights, imageUrl, includes,
      isActive: isActive === 'true',
      sortOrder: parseInt(sortOrder) || 0
    });
    req.session.flashMsg = { type:'success', text:'✅ Package added successfully!' };
    res.redirect('/admin/packages');
  } catch (err) {
    console.error(err);
    res.render('admin-package-form', { pkg: null, error: 'Failed to add package: ' + err.message });
  }
});

router.get('/packages/edit/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.redirect('/admin/packages');
    res.render('admin-package-form', { pkg });
  } catch { res.redirect('/admin/packages'); }
});

router.post('/packages/edit/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { name, destination, duration, price, priceLabel, badge, description, highlights, imageUrl, includes, isActive, sortOrder } = req.body;
    await Package.findByIdAndUpdate(req.params.id, {
      name, destination, duration,
      price: parseFloat(price) || 0,
      priceLabel, badge, description,
      highlights, imageUrl, includes,
      isActive: isActive === 'true',
      sortOrder: parseInt(sortOrder) || 0
    });
    req.session.flashMsg = { type:'success', text:'✅ Package updated successfully!' };
    res.redirect('/admin/packages');
  } catch (err) {
    const pkg = await Package.findById(req.params.id).catch(()=>null);
    res.render('admin-package-form', { pkg, error: 'Update failed: ' + err.message });
  }
});

router.post('/packages/delete/:id', isAdminAuthenticated, async (req, res) => {
  await Package.findByIdAndDelete(req.params.id).catch(()=>{});
  req.session.flashMsg = { type:'success', text:'🗑 Package deleted.' };
  res.redirect('/admin/packages');
});

// ══════════════════════════════════════════════════════════════
// CONTACTS
// ══════════════════════════════════════════════════════════════
router.get('/contacts', isAdminAuthenticated, async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  const msg = req.session.flashMsg; delete req.session.flashMsg;
  res.render('admin-contacts', { contacts, msg });
});

router.post('/contacts/read/:id', isAdminAuthenticated, async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, { isRead: true }).catch(()=>{});
  res.redirect('/admin/contacts');
});

router.post('/contacts/mark-all-read', isAdminAuthenticated, async (req, res) => {
  await Contact.updateMany({ isRead: false }, { isRead: true }).catch(()=>{});
  req.session.flashMsg = { type:'success', text:'✅ All enquiries marked as read.' };
  res.redirect('/admin/contacts');
});

router.post('/contacts/delete/:id', isAdminAuthenticated, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id).catch(()=>{});
  req.session.flashMsg = { type:'success', text:'🗑 Enquiry deleted.' };
  res.redirect('/admin/contacts');
});

// ══════════════════════════════════════════════════════════════
// AGENTS
// ══════════════════════════════════════════════════════════════
router.get('/agents', isAdminAuthenticated, async (req, res) => {
  const agents = await Agent.find().sort({ createdAt: -1 });
  const msg = req.session.flashMsg; delete req.session.flashMsg;
  res.render('admin-agents', { agents, msg });
});

router.post('/agents/status/:id', isAdminAuthenticated, async (req, res) => {
  await Agent.findByIdAndUpdate(req.params.id, { status: req.body.status }).catch(()=>{});
  req.session.flashMsg = { type:'success', text:`✅ Agent ${req.body.status}.` };
  res.redirect('/admin/agents');
});

router.post('/agents/delete/:id', isAdminAuthenticated, async (req, res) => {
  await Agent.findByIdAndDelete(req.params.id).catch(()=>{});
  req.session.flashMsg = { type:'success', text:'🗑 Agent deleted.' };
  res.redirect('/admin/agents');
});

// ══════════════════════════════════════════════════════════════
// USERS
// ══════════════════════════════════════════════════════════════
router.get('/users', isAdminAuthenticated, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  const msg = req.session.flashMsg; delete req.session.flashMsg;
  res.render('admin-users', { users, msg });
});

router.post('/users/toggle/:id', isAdminAuthenticated, async (req, res) => {
  const user = await User.findById(req.params.id).catch(()=>null);
  if (user) await User.findByIdAndUpdate(req.params.id, { isActive: !user.isActive });
  req.session.flashMsg = { type:'success', text:'✅ User status updated.' };
  res.redirect('/admin/users');
});

router.post('/users/delete/:id', isAdminAuthenticated, async (req, res) => {
  await User.findByIdAndDelete(req.params.id).catch(()=>{});
  req.session.flashMsg = { type:'success', text:'🗑 User deleted.' };
  res.redirect('/admin/users');
});

module.exports = router;
