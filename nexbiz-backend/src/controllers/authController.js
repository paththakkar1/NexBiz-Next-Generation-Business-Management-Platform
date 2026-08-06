const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// User Registration
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'Customer']
        );

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Login successful.',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
};

// Fetch Logged-in User Profile
exports.getProfile = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        if (users.length === 0) return res.status(404).json({ message: 'User not found.' });

        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving profile.', error: error.message });
    }
};