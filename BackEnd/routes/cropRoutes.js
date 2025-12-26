const express = require('express');
const router = express.Router();

// Mock Rules Engine for Recommendations
const getRecommendations = (soil, season) => {
    // 1. Static Rules Logic (Free API equivalent)
    const recommendations = [];

    if (soil === 'Clay') {
        if (season === 'Kharif') recommendations.push({ name: 'Rice', water: 'High', demand: 'High' });
        if (season === 'Rabi') recommendations.push({ name: 'Wheat', water: 'Moderate', demand: 'High' });
    } else if (soil === 'Loamy') {
        recommendations.push({ name: 'Vegetables', water: 'Moderate', demand: 'Medium' });
        recommendations.push({ name: 'Cotton', water: 'Moderate', demand: 'High' });
    } else if (soil === 'Sandy') {
        recommendations.push({ name: 'Groundnut', water: 'Low', demand: 'Medium' });
        recommendations.push({ name: 'Millets', water: 'Low', demand: 'Low' });
    }

    // Default fallback
    if (recommendations.length === 0) {
        recommendations.push({ name: 'Maize', water: 'Moderate', demand: 'Medium' });
    }

    return recommendations;
};

router.post('/recommend', (req, res) => {
    const { soil_type, season } = req.body;

    if (!soil_type || !season) {
        return res.status(400).json({ message: 'Soil type and Season are required' });
    }

    const recs = getRecommendations(soil_type, season);
    res.json(recs);
});

module.exports = router;
