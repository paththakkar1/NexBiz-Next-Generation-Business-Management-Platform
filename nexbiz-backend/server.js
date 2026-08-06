const express = require('express');
const path = require('path');

// Load environment variables from backend directory or root directory
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('NexBiz API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});