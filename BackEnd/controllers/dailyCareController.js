const DailyCare = require('../models/DailyCare');

// Get daily care tasks based on crop
exports.getDailyCareTasks = async (req, res) => {
    const { crop } = req.query;  // Extract crop from query parameters

    try {
        // Find daily care tasks for the specified crop
        const dailyCareTasks = await DailyCare.findOne({ crop });

        if (!dailyCareTasks) {
            return res.status(404).json({ message: 'No daily care tasks found for this crop' });
        }

        res.json({ tasks: dailyCareTasks.tasks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
