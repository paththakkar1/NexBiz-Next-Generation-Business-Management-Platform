const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: String,
    quantity: { type: Number, required: true, default: 0 },
    minStockThreshold: { type: Number, default: 10 },
    price: { type: Number, required: true },
    barcode: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);