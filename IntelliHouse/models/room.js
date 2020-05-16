const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: String,
    thermostatId: Number,
    lightsId: Number
});

module.exports = mongoose.model("Room", roomSchema);