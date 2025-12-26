const mongoose = require('mongoose');

const dailyCareSchema = mongoose.Schema({
    crop: { type: String, required: true },
    tasks: [
        {
            task: { type: String, required: true },
            description: { type: String, required: true },
            recommendedAction: { type: String, required: true },
        },
    ],
});

const DailyCare = mongoose.model('DailyCare', dailyCareSchema);

module.exports = DailyCare;
