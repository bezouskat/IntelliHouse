const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Room = require("./models/room");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static(__dirname));

mongoose.connect("mongodb://localhost/SWINZ", {
    useNewUrlParser: true, useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/rooms", (req, res) => {
    Room.find({})
    .then(rooms => res.render("rooms", {rooms: rooms}))
    .catch(err => console.log(err));
});

app.get("/rooms/:id", (req, res) => {
    Room.find({})
    .then(rooms => {
        for (let room of rooms) {
            if (room._id.toString().localeCompare(req.params.id) == 0) {
                const selectedRoom = room;
                
                return res.render("detail", {
                    rooms: rooms, selectedRoom: selectedRoom
                });
            }
        }
    })
    .catch(err => console.log(err));
});

app.post("/rooms", (req, res) => {
    Room.create({
        name: "Nová místnost",
        temperature: 18,
        consumption: 0,
        lightsOn: false,
        heatingOn: false,
        heatingTemp: 5,
        avgLightingLastWeek: [0, 0, 0, 0, 0, 0, 0]
    }).then(newRoom => {
        res.json({newRoomId: newRoom._id.toString()});
    })
    .catch(err => console.log(err));
}) 

app.delete("/rooms/:id", (req, res) => {
    Room.deleteOne({_id: req.params.id})
    .then(res.sendStatus(200));
});

app.put("/rooms/:id", (req, res) => {
    Room.findOneAndUpdate({_id: req.params.id}, req.body)
    .then(res.sendStatus(200))
    .catch(err => console.log(err));
});

app.get("/statistics", (req, res) => {
    Room.find({}, (err, rooms) => {
        if (err) {
            console.log(err);
        } else {
            res.render("statistics.ejs", {rooms: rooms});
        }
    });
});

app.listen(8080, () => {
    console.log("Listening on port 8080...");
});