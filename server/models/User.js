const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    username: { type: String, trim: true, unique: true, sparse: true },
    avatar: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    address: { type: String, default: '', maxlength: 200 },
    phone: { type: String, default: '', maxlength: 40 },
    education: [
      {
        degree: { type: String, trim: true },
        institution: { type: String, trim: true },
        year: { type: String, trim: true },
      },
    ],
    workExperience: [
      {
        position: { type: String, trim: true },
        company: { type: String, trim: true },
        year: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
