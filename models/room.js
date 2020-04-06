const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: String,
    temperature: Number,
    consumption: Number,
    lightsOn: Boolean,
    heatingOn: Boolean,
    heatingTemp: Number,
    avgLightingLastWeek: [Number]
});

module.exports = mongoose.model("Room", roomSchema);