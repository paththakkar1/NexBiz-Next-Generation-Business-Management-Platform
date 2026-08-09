const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [{
        productName: String,
        quantity: Number,
        unitPrice: Number,
        amount: Number
    }],
    subTotal: Number,
    gstAmount: Number,
    totalAmount: Number,
    status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' },
    paymentDetails: {
        razorpayOrderId: String,
        razorpayPaymentId: String,
        paidAt: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
