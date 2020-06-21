const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static(__dirname));

const room_controller = require("./controllers/room");

app.get("/", room_controller.index);

app.get("/rooms", room_controller.room_list);

app.get("/rooms/:id", room_controller.room_detail);

app.get("/rooms/:id/values", room_controller.room_detail_values);

app.get("/statistics", room_controller.room_statistics);

app.post("/rooms", room_controller.room_create); 

app.delete("/rooms/:id", room_controller.room_delete);

app.put("/rooms/:id", room_controller.room_update);

module.exports = app;