const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Mount API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'chess-course-validation',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
