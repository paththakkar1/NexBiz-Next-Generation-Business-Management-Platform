// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await User.deleteMany();
        await User.create({
            name: 'Admin User',
            email: 'admin@nexbiz.com',
            password: '$2a$10$hashedPasswordHere', // Replace with bcrypt hash
            role: 'Admin'
        });
        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();