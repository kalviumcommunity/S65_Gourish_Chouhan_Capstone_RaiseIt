const mongoose = require('mongoose');

const causeSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    mission: { type: String, required: true, trim: true, maxlength: 800 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    logo: { type: String, default: '', trim: true },
    image: { type: String, default: '', trim: true },
    featuredProject: { type: String, default: '', trim: true, maxlength: 160 },
    impact: { type: String, default: '', trim: true, maxlength: 500 },
    urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cause', causeSchema);
