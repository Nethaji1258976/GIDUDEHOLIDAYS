/**
 * GoDude Holidays - Database Models
 * MongoDB Schemas: User, Contact, Agent, Admin
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ─── User (website login) ──────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  fullName:   { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone:      { type: String, trim: true },
  password:   { type: String, required: true },
  createdAt:  { type: Date, default: Date.now },
  isActive:   { type: Boolean, default: true }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain password to hashed
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

// ─── Contact Form Submission ───────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true },
  phone:     { type: String, trim: true },
  subject:   { type: String, trim: true },
  message:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isRead:    { type: Boolean, default: false }
});

// ─── Agent / B2B Registration ─────────────────────────────────────────────────
const agentSchema = new mongoose.Schema({
  agencyName:    { type: String, required: true, trim: true },
  contactPerson: { type: String, required: true, trim: true },
  mobile:        { type: String, required: true, trim: true },
  email:         { type: String, required: true, trim: true },
  cityState:     { type: String, trim: true },
  businessType:  { type: String, trim: true },
  destinations:  { type: String, trim: true },
  monthlyVolume: { type: String, trim: true },
  message:       { type: String, trim: true },
  createdAt:     { type: Date, default: Date.now },
  status:        { type: String, default: 'pending', enum: ['pending','approved','rejected'] }
});

const User    = mongoose.model('User',    userSchema);
const Contact = mongoose.model('Contact', contactSchema);
const Agent   = mongoose.model('Agent',   agentSchema);

module.exports = { User, Contact, Agent };
