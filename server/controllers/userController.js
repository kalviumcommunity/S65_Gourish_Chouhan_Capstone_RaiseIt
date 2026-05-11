const mongoose = require('mongoose');
const User = require('../models/User');
const Concern = require('../models/Concern');
const Group = require('../models/Group');
const Donation = require('../models/Donation');

const profileFields = 'name email username avatar coverImage bio address phone education workExperience role createdAt';

const sanitizeItems = (items, allowedKeys) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) =>
      allowedKeys.reduce((acc, key) => {
        acc[key] = typeof item?.[key] === 'string' ? item[key].trim() : '';
        return acc;
      }, {})
    )
    .filter((item) => Object.values(item).some(Boolean));
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });

    const user = await User.findById(id).select(profileFields);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (updates.username && updates.username !== user.username) {
      const usernameExists = await User.findOne({ username: updates.username.trim(), _id: { $ne: user._id } });
      if (usernameExists) return res.status(400).json({ message: 'Username is already taken' });
      user.username = updates.username.trim();
    }

    ['name', 'avatar', 'coverImage', 'bio', 'address', 'phone'].forEach((field) => {
      if (typeof updates[field] === 'string') user[field] = updates[field].trim();
    });

    user.education = sanitizeItems(updates.education, ['degree', 'institution', 'year']);
    user.workExperience = sanitizeItems(updates.workExperience, ['position', 'company', 'year']);

    await user.save();

    const updated = await User.findById(user._id).select(profileFields);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

exports.getUserConcerns = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });

    const concerns = await Concern.find({ user: id }).sort({ createdAt: -1 }).populate('user', 'name email');
    res.json(concerns);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user concerns' });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });

    const groups = await Group.find({ members: id }).sort({ createdAt: -1 }).populate('creator', 'name email');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user groups' });
  }
};

exports.getUserDonations = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });

    const donations = await Donation.find({ user: id, status: 'verified' }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user donations' });
  }
};
