const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Get Profile
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Get user info + profile info
        const [users] = await db.query('SELECT id, name, phone_number, role FROM users WHERE id = ?', [req.user.id]);
        const [profiles] = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [req.user.id]);

        if (!users[0]) return res.status(404).json({ message: 'User not found' });

        res.json({
            ...users[0],
            profile: profiles[0] || {}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Profile
router.post('/', authMiddleware, async (req, res) => {
    const { address, farm_location, soil_type, farm_size } = req.body;
    const userId = req.user.id;

    try {
        // Check if profile exists
        const [existing] = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);

        if (existing.length > 0) {
            // Update
            await db.query(
                'UPDATE user_profiles SET address=?, farm_location=?, soil_type=?, farm_size=? WHERE user_id=?',
                [address, farm_location, soil_type, farm_size, userId]
            );
        } else {
            // Insert
            await db.query(
                'INSERT INTO user_profiles (user_id, address, farm_location, soil_type, farm_size) VALUES (?, ?, ?, ?, ?)',
                [userId, address, farm_location, soil_type, farm_size]
            );
        }
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

module.exports = router;
