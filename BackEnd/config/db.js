const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite (creates file if missing)
const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initSchema();
    }
});

function initSchema() {
    db.serialize(() => {
        // Users
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phone_number TEXT UNIQUE,
            password TEXT,
            role TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // User Profiles
        db.run(`CREATE TABLE IF NOT EXISTS user_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE,
            address TEXT,
            farm_location TEXT, 
            soil_type TEXT,
            farm_size TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Crops
        db.run(`CREATE TABLE IF NOT EXISTS crops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_name TEXT,
            soil_type TEXT,
            climate TEXT,
            growth_days INTEGER,
            image_url TEXT
        )`);

        // Marketplace
        db.run(`CREATE TABLE IF NOT EXISTS marketplace (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_id INTEGER,
            crop_id INTEGER,
            price REAL,
            quantity REAL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (farmer_id) REFERENCES users(id),
            FOREIGN KEY (crop_id) REFERENCES crops(id)
        )`);

        // Orders
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            buyer_id INTEGER,
            listing_id INTEGER,
            quantity REAL,
            total_price REAL,
            status TEXT DEFAULT 'pending',
            order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (buyer_id) REFERENCES users(id),
            FOREIGN KEY (listing_id) REFERENCES marketplace(id)
        )`);

        // GPS Tracking
        db.run(`CREATE TABLE IF NOT EXISTS gps_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            latitude REAL,
            longitude REAL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id)
        )`);

        // Crop Calendar
        db.run(`CREATE TABLE IF NOT EXISTS crop_calendars (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_name TEXT,
            day_number INTEGER,
            task TEXT,
            stage TEXT,
            advice TEXT
        )`);

        // Notifications
        db.run(`CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            message TEXT,
            type TEXT, 
            is_read BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Seed Crops
        db.get("SELECT count(*) as count FROM crops", (err, row) => {
            if (row.count === 0) {
                console.log("Seeding crops...");
                const stmt = db.prepare("INSERT INTO crops (crop_name, soil_type, climate, growth_days) VALUES (?, ?, ?, ?)");
                const crops = [
                    ['Wheat', 'Loamy', 'Cool', 120],
                    ['Rice', 'Clay', 'Tropical', 150],
                    ['Corn', 'Sandy Loam', 'Warm', 90],
                    ['Cotton', 'Black Soil', 'Warm', 160],
                    ['Sugarcane', 'Loamy', 'Tropical', 365],
                    ['Tomato', 'Sandy Loam', 'Temperate', 80],
                    ['Potato', 'Loose Loam', 'Cool', 100],
                    ['Groundnut', 'Sandy', 'Warm', 110],
                    ['Chili', 'Sandy Loam', 'Warm', 140],
                    ['Onion', 'Loamy', 'Temperate', 120]
                ];
                crops.forEach(c => stmt.run(c));
                stmt.finalize();
            }
        });

        // Seed Calendar
        db.get("SELECT count(*) as count FROM crop_calendars", (err, row) => {
            if (row.count === 0) {
                console.log("Seeding calendar...");
                const stmt = db.prepare("INSERT INTO crop_calendars (crop_name, day_number, task, stage, advice) VALUES (?, ?, ?, ?, ?)");

                const calendarData = [
                    ['Wheat', 1, 'Sowing', 'Sowing', 'Sow seeds 4-5 cm deep.'],
                    ['Wheat', 21, 'CRI Stage Watering', 'Watering', 'Apply first irrigation.'],
                    ['Wheat', 45, 'Tillering', 'Care', 'Apply Nitrogen fertilizer.'],
                    ['Wheat', 85, 'Flowering', 'Observation', 'Monitor for rust.'],
                    ['Wheat', 115, 'Harvesting', 'Harvest', 'Harvest when grain is hard.'],

                    ['Rice', 1, 'Nursery Sowing', 'Sowing', 'Prepare raised beds.'],
                    ['Rice', 25, 'Transplanting', 'Planting', 'Transplant seedlings.'],
                    ['Rice', 50, 'Tillering', 'Care', 'Maintain 5cm water level.'],
                    ['Rice', 90, 'Panicle Initiation', 'Watering', 'Critical water stage.'],
                    ['Rice', 140, 'Harvesting', 'Harvest', 'Drain water 10 days before harvest.'],

                    ['Cotton', 1, 'Sowing', 'Sowing', 'Treat seeds with fungicide.'],
                    ['Cotton', 40, 'Square Formation', 'Watering', 'Apply micro-nutrients.'],
                    ['Cotton', 80, 'Flowering', 'Care', 'Monitor for bollworms.'],
                    ['Cotton', 160, 'Picking', 'Harvest', 'Pick fully burst bolls.'],

                    ['Tomato', 1, 'Nursery Sowing', 'Sowing', 'Use coco-peat trays.'],
                    ['Tomato', 25, 'Transplanting', 'Planting', 'Plant in ridges.'],
                    ['Tomato', 45, 'Flowering', 'Watering', 'Spray Calcium.'],
                    ['Tomato', 70, 'Harvesting', 'Harvest', 'Pick at breaker stage.'],

                    // POTATO
                    ['Potato', 1, 'Sowing', 'Sowing', 'Plant tubers 15cm deep.'],
                    ['Potato', 25, 'Earthing Up', 'Care', 'Cover tubers with soil to prevent greening.'],
                    ['Potato', 45, 'Tuber Initiation', 'Watering', 'Maintain moisture for size.'],
                    ['Potato', 90, 'Dehaulming', 'Harvest', 'Cut stems 10 days before harvest.'],

                    // CORN / MAIZE
                    ['Corn', 1, 'Sowing', 'Sowing', 'Sow in rows with 60cm spacing.'],
                    ['Corn', 20, 'Knee High Stage', 'Care', 'Apply Nitrogen top dressing.'],
                    ['Corn', 50, 'Tasseling', 'Watering', 'Critical for pollination.'],
                    ['Corn', 90, 'Harvesting', 'Harvest', 'Harvest when cob silk turns dry.'],

                    // SUGARCANE
                    ['Sugarcane', 1, 'Planting', 'Sowing', 'Place setts in furrows.'],
                    ['Sugarcane', 45, 'Formative Stage', 'Care', 'Apply heavy irrigation.'],
                    ['Sugarcane', 120, 'Grand Growth', 'Watering', 'Max water needed.'],
                    ['Sugarcane', 300, 'Maturity', 'Harvest', 'Harvest when Brix reading > 18.'],

                    // GROUNDNUT
                    ['Groundnut', 1, 'Sowing', 'Sowing', 'Treat seeds with Rhizobium.'],
                    ['Groundnut', 25, 'Flowering', 'Watering', 'Light irrigation.'],
                    ['Groundnut', 45, 'Pegging', 'Care', 'Do not disturb soil now.'],
                    ['Groundnut', 110, 'Harvesting', 'Harvest', 'Pull plants when leaves yellow.'],

                    // CHILI
                    ['Chili', 1, 'Nursery', 'Sowing', 'Raise seedlings in shade.'],
                    ['Chili', 30, 'Transplanting', 'Planting', 'Transplant in evening.'],
                    ['Chili', 60, 'Flowering', 'Care', 'Spray Neem oil for pests.'],
                    ['Chili', 90, 'Picking', 'Harvest', 'Pick red or green fruits.'],

                    // ONION
                    ['Onion', 1, 'Nursery', 'Sowing', 'Sow seeds 1cm deep.'],
                    ['Onion', 45, 'Transplanting', 'Planting', 'Trim tops before planting.'],
                    ['Onion', 90, 'Bulb Formation', 'Watering', 'Stop water 15 days before harvest.'],
                    ['Onion', 120, 'Harvesting', 'Harvest', 'Harvest when 50% tops fall over.']
                ];

                calendarData.forEach(item => stmt.run(item));
                stmt.finalize();
            }
        });
    });
}

// Promisify helper
db.query = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        const command = sql.trim().toUpperCase().split(' ')[0];
        if (command === 'SELECT') {
            this.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve([rows]);
            });
        } else {
            this.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
            });
        }
    });
};

module.exports = db;
