const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const concernRoutes = require('./routes/concernRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/concerns', concernRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));