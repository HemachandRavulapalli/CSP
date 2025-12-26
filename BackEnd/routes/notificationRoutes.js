const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Get Notifications
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// Mark as read
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        await db.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

// Create Notification (Internal/Admin/System use) -> for demo we allow easy creation
router.post('/create', authMiddleware, async (req, res) => {
    const { message, type } = req.body;
    try {
        await db.query(
            'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
            [req.user.id, message, type || 'info']
        );
        res.json({ message: 'Notification created' });
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

module.exports = router;
