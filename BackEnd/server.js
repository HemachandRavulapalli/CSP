const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/marketplace')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Initialize dotenv for environment variables
dotenv.config();

// Create an instance of the express app
const app = express();

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Middleware to handle CORS and body parsing
app.use(cors());
app.use(bodyParser.json());

// Basic route to check if the server is working
app.get('/', (req, res) => {
    res.send('Farm Management System API is running');
});

// 1. **Login Route**
app.post('/api/login', (req, res) => {
    const { phone, password } = req.body;

    // Placeholder authentication logic
    if (phone === '1234567890' && password === 'password123') {
        const token = 'sample-token'; // In real cases, generate a JWT or similar token
        res.status(200).json({ message: 'Login successful', token });
    } else {
        res.status(401).json({ message: 'Invalid phone or password' });
    }
});

// 2. **OTP Sending Route**
app.post('/api/send-otp', (req, res) => {
    const { phone } = req.body;

    // Placeholder for OTP logic
    res.status(200).json({ message: `OTP sent to ${phone}` });
});

// 3. **Registration Route**
app.post('/api/register', (req, res) => {
    const { name, phone, password, otp } = req.body;

    // Placeholder registration logic
    if (otp === '123456') { // Example: Check OTP validity
        res.status(201).json({ message: 'Registration successful' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
});

// 4. **Weather Data Fetching (For Recommendations or Daily Care Page)**
app.get('/api/weather', async (req, res) => {
    const location = req.query.location || 'New York'; // Default to New York if no location is provided
    const apiKey = '8bf2a1a3dc34458bf2fff56a62dba206'; // Make sure this is correct
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    console.log('Requesting weather data from URL:', url); // Log the URL to debug

    try {
        const response = await axios.get(url);
        const weatherData = response.data;

        res.json({
            location: weatherData.name,
            weather: {
                temperature: `${weatherData.main.temp}°C`,
                humidity: `${weatherData.main.humidity}%`,
                forecast: weatherData.weather[0].description,
            }
        });
    } catch (error) {
        console.error('Error fetching weather data:', error.message); // Log the specific error
        res.status(500).json({ message: 'Error fetching weather data. Please try again later.' });
    }
});

// Crop Model (Assuming it's defined in models/Crop.js)
const Crop = require('./models/Crop');

// 5. **GET all crops in the marketplace**
app.get('/api/marketplace', async (req, res) => {
    try {
        const crops = await Crop.find();  // Fetch all crops from the database
        res.status(200).json({ marketplace: crops });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching marketplace data' });
    }
});

// 6. **POST a new crop to the marketplace**
app.post('/api/marketplace', async (req, res) => {
    const { crop, seller, price, location } = req.body;

    if (!crop || !seller || !price || !location) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newCrop = new Crop({ crop, seller, price, location });
        await newCrop.save();
        res.status(201).json({ message: 'Crop added successfully', crop: newCrop });
    } catch (error) {
        res.status(500).json({ message: 'Error adding crop to marketplace' });
    }
});

// 7. **PUT (update) a crop listing**
app.put('/api/marketplace/:id', async (req, res) => {
    const { id } = req.params;
    const { crop, seller, price, location } = req.body;

    try {
        const updatedCrop = await Crop.findByIdAndUpdate(id, { crop, seller, price, location }, { new: true });
        if (!updatedCrop) return res.status(404).json({ message: 'Crop not found' });
        res.status(200).json({ message: 'Crop updated successfully', crop: updatedCrop });
    } catch (error) {
        res.status(500).json({ message: 'Error updating crop' });
    }
});

// 8. **DELETE a crop listing**
app.delete('/api/marketplace/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCrop = await Crop.findByIdAndDelete(id);
        if (!deletedCrop) return res.status(404).json({ message: 'Crop not found' });
        res.status(200).json({ message: 'Crop deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting crop' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
