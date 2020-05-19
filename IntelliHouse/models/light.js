const mongoose = require("mongoose");

const lightSchema = new mongoose.Schema({
    _id: Number
});

module.exports = mongoose.model("Light", lightSchema);