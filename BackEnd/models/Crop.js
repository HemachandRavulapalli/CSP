// models/Crop.js
const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    crop: { type: String, required: true },
    seller: { type: String, required: true },
    price: { type: String, required: true },
    location: { type: String, required: true },
});

const Crop = mongoose.model('Crop', cropSchema);
module.exports = Crop;
