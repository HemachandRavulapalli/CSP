const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();

// Mock OTP Store (In-memory)
const otpStore = {};

// Send OTP
router.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number required' });

    // Mock OTP generation
    const otp = '1234';
    otpStore[phone] = otp;

    console.log(`OTP for ${phone} is ${otp}`);
    res.json({ message: 'OTP sent successfully', otp: '1234' }); // Sending back for demo purposes
});

// Verify OTP & Login/Register
router.post('/verify-otp', async (req, res) => {
    const { phone, otp, name, role } = req.body;

    if (otpStore[phone] !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    delete otpStore[phone];

    try {
        // Check if user exists
        let [rows] = await db.query('SELECT * FROM users WHERE phone_number = ?', [phone]);
        let user = rows[0];

        if (!user) {
            // Register if not exists
            if (!name || !role) return res.status(400).json({ message: 'New user: Name and Role required' });

            const [result] = await db.query('INSERT INTO users (name, phone_number, role) VALUES (?, ?, ?)', [name, phone, role]);
            user = { id: result.insertId, name, phone_number: phone, role };
        }

        const token = jwt.sign(
            { id: user.id, phone: user.phone_number, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
