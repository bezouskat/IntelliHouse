const mongoose = require("mongoose");

const thermostatSchema = new mongoose.Schema({
    _id: Number
});

module.exports = mongoose.model("Thermostat", thermostatSchema);