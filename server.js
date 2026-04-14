/**
 * GoDude Holidays — Main Server
 * Node.js + Express + MongoDB + User Auth + Admin Panel
 */

require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const session    = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const path       = require('path');
const helmet     = require('helmet');

const app  = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/godude_holidays';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => console.error('❌  MongoDB error:', err.message));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:    ["'self'", "https://fonts.gstatic.com"],
      imgSrc:     ["'self'", "data:", "https://images.unsplash.com", "https://*"],
      scriptSrc:  ["'self'", "'unsafe-inline'"]
    }
  }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'godude_secret_change_in_prod_2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    touchAfter: 24 * 3600,
    ttl: 7 * 24 * 60 * 60
  }),
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true }
}));

app.use((req, res, next) => {
  res.locals.user       = req.session.user  || null;
  res.locals.userId     = req.session.userId || null;
  res.locals.isLoggedIn = !!req.session.userId;
  next();
});

app.use('/',      require('./routes/auth'));
app.use('/',      require('./routes/main'));
app.use('/admin', require('./routes/admin'));
app.use('/api',   require('./routes/api'));

app.use((req, res) => res.status(404).render('404'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('<h1>500 — Server Error</h1><p>' + err.message + '</p><a href="/">Home</a>');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`\n🚀  GoDude Holidays  →  http://localhost:${PORT}`);
  console.log(`🔐  Admin Panel      →  http://localhost:${PORT}/admin`);
  console.log(`👤  Register         →  http://localhost:${PORT}/register\n`);
});

module.exports = app;
