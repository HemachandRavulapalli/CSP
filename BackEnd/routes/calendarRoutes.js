const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/:cropName', async (req, res) => {
    try {
        const { cropName } = req.params;
        const [rows] = await db.query(
            'SELECT * FROM crop_calendars WHERE crop_name = ? ORDER BY day_number ASC',
            [cropName]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching calendar' });
    }
});

module.exports = router;
