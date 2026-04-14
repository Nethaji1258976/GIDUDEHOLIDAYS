const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  duration:    { type: String, required: true, trim: true },
  price:       { type: Number, required: true, min: 0 },
  priceLabel:  { type: String, default: 'per person', trim: true },
  badge:       { type: String, trim: true },           // e.g. "Popular", "New"
  description: { type: String, required: true, trim: true },
  highlights:  { type: String, trim: true },           // newline-separated
  includes:    { type: String, trim: true },           // comma-separated
  imageUrl:    { type: String, trim: true },
  isActive:    { type: Boolean, default: true },
  sortOrder:   { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Package', packageSchema);
