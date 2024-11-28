const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,        // Use the new URL parser for compatibility
            useUnifiedTopology: true,    // Use unified topology for better connection handling
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
