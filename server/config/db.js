const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexbiz_db';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connection established successfully.');
  })
  .catch((error) => {
    console.error('MongoDB database connection failed! Check MONGODB_URI in your .env file.');
    console.error('Error details:', error.message);
  });

module.exports = mongoose;
