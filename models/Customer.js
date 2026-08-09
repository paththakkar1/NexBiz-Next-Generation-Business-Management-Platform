const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company: String,
    email: { type: String, required: true },
    phone: String,
    status: { type: String, enum: ['Lead', 'Contacted', 'Qualified', 'Won', 'Lost'], default: 'Lead' },
    notes: [{
        content: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);