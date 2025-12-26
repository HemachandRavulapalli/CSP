const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// List all items
router.get('/browse', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.*, c.crop_name, u.name as farmer_name 
            FROM marketplace m
            JOIN crops c ON m.crop_id = c.id
            JOIN users u ON m.farmer_id = u.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching marketplace' });
    }
});

// Add listing (Farmer only)
router.post('/list', authMiddleware, async (req, res) => {
    const { crop_id, price, quantity, description } = req.body;

    if (req.user.role !== 'farmer') {
        return res.status(403).json({ message: 'Only farmers can list crops' });
    }

    try {
        await db.query(
            'INSERT INTO marketplace (farmer_id, crop_id, price, quantity, description) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, crop_id, price, quantity, description]
        );
        res.status(201).json({ message: 'Crop listed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error listing crop' });
    }
});

// Buy item
router.post('/buy', authMiddleware, async (req, res) => {
    const { listing_id, quantity } = req.body;

    try {
        const [listings] = await db.query('SELECT * FROM marketplace WHERE id = ?', [listing_id]);
        if (listings.length === 0) return res.status(404).json({ message: 'Listing not found' });

        const listing = listings[0];
        const totalPrice = listing.price * quantity;

        // Create Order
        const [orderResult] = await db.query(
            'INSERT INTO orders (buyer_id, listing_id, quantity, total_price) VALUES (?, ?, ?, ?)',
            [req.user.id, listing_id, quantity, totalPrice]
        );

        // Initialize GPS Tracking for order
        await db.query(
            'INSERT INTO gps_tracking (order_id, latitude, longitude) VALUES (?, ?, ?)',
            [orderResult.insertId, 40.7128, -74.0060] // Default Start at NY
        );

        res.status(201).json({ message: 'Order placed successfully', orderId: orderResult.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error placing order' });
    }
});

module.exports = router;
