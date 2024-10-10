require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const fetchCryptoData = require('./services/crypto');
const statsRoute = require('./routes/stats');
const deviationRoute = require('./routes/deviation');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: 'https://assignmentcrypto.netlify.app', // Allow your frontend origin
  methods: ['GET', 'POST'], // Specify allowed methods
  credentials: true
}));
// Connect to MongoDB
connectDB();

// Fetch initial crypto data
fetchCryptoData();

// Middleware
app.use(express.json());

// Routes
app.use('/api', statsRoute);
app.use('/api', deviationRoute);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
