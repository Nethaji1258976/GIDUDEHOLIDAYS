// ── User Auth Guard ───────────────────────────────────────────
const isUserAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  res.redirect('/login');
};

// ── Admin Auth Guard ──────────────────────────────────────────
const isAdminAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminLoggedIn) return next();
  res.redirect('/admin/login');
};

module.exports = { isUserAuthenticated, isAdminAuthenticated };
