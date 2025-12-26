const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get Recommendations
router.get('/recommendations', async (req, res) => {
    try {
        // Simple logic: return all crops for now. In real app, filter by soil/weather
        const [crops] = await db.query('SELECT * FROM crops');
        res.json(crops);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
});

// GPS Tracking with Simulation
router.get('/track/:orderId', async (req, res) => {
    try {
        const [tracking] = await db.query('SELECT * FROM gps_tracking WHERE order_id = ?', [req.params.orderId]);
        if (tracking.length === 0) return res.status(404).json({ message: 'Tracking not found' });

        // Simulate Movement: Move slightly North-East on every poll
        const currentLat = tracking[0].latitude;
        const currentLng = tracking[0].longitude;
        const newLat = currentLat + 0.0001; // Small increment
        const newLng = currentLng + 0.0001;

        // Update DB
        await db.query('UPDATE gps_tracking SET latitude = ?, longitude = ? WHERE order_id = ?', [newLat, newLng, req.params.orderId]);

        res.json({ ...tracking[0], latitude: newLat, longitude: newLng });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tracking' });
    }
});

// Daily Suggestions Stub
router.get('/suggestions/today', (req, res) => {
    res.json({
        message: "Today is a good day to water your wheat crops.",
        tasks: ["Check for pests", "Watering (Moderate)"]
    });
});

module.exports = router;
