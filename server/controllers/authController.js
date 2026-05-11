const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getRoleForEmail = (email) => {
  const admins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase()) ? 'admin' : 'user';
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    if (password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: getRoleForEmail(normalizedEmail),
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Registration failed:', error.message);
    res.status(500).json({
      message: process.env.NODE_ENV === 'production' ? 'Registration failed' : error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const envRole = getRoleForEmail(user.email);
    if (envRole !== user.role) {
      user.role = envRole;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).json({
      message: process.env.NODE_ENV === 'production' ? 'Login failed' : error.message,
    });
  }
};
