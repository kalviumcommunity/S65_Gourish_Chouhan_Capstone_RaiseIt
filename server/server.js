const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const connectDB = require('./config/db');
const concernRoutes = require('./routes/concernRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const passport = require('./config/passport');
const paymentRoutes = require('./routes/paymentRoutes');
const geminiRoutes = require('./routes/geminiRoutes');

connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/concerns', concernRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use(passport.initialize());
app.use('/api/payments', paymentRoutes);
app.use('/api/gemini', geminiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));