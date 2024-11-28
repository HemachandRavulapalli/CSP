const Order = require('../models/order');

// GET all orders for a user
exports.getUserOrders = async (req, res) => {
    const userId = req.userId; // Extract from middleware if using token-based authentication

    try {
        const orders = await Order.find({ user: userId });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

// UPDATE order status
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status' });
    }
};
