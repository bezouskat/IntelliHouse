const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = Schema({
    name: String,
    light: { type: Schema.Types.Number, ref: 'Light' },
    thermostat: { type: Schema.Types.Number, ref: 'Thermostat' }
});

module.exports = mongoose.model("Room", roomSchema);