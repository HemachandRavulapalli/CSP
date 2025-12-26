const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const gpsRoutes = require('./routes/gpsRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const profileRoutes = require('./routes/profileRoutes');
const cropRoutes = require('./routes/cropRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' })); // Allow all for simplicity
app.use(bodyParser.json());

// Logger Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// DB Initialization happens securely in ./config/db.js
require('./config/db');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/gps', gpsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('IFMMS API is running with SQLite');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
