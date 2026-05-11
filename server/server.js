const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { validateEnv } = require('./config/env');
const { standardLimiter, authLimiter, uploadLimiter } = require('./middlewares/rateLimiters');
const concernRoutes = require('./routes/concernRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const passport = require('./config/passport');
const paymentRoutes = require('./routes/paymentRoutes');
const geminiRoutes = require('./routes/geminiRoutes');
const groupRoutes = require('./routes/groupRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const causeRoutes = require('./routes/causeRoutes');

validateEnv();
const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use('/api', standardLimiter);
app.use(passport.initialize());

app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/concerns', concernRoutes);
app.use('/api/upload', uploadLimiter, uploadRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/causes', causeRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack || err.message);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

async function startServer() {
  const PORT = process.env.PORT || 5000;
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

if (require.main === module) {
  startServer().catch(() => {
    process.exit(1);
  });
}

module.exports = app;
