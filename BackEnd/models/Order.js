const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    crop: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
