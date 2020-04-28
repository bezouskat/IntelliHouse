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

const Requests = require('./requests');

setInterval(Requests.updateAllDevices, 1000);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/rooms", (req, res) => {
    Room.find({})
    .then(rooms => res.render("rooms", {rooms: rooms}));
});

app.get("/rooms/:id", (req, res) => {
    Room.find({})
    .then(rooms => {
        for (let room of rooms) {
            if (room._id.toString().localeCompare(req.params.id) == 0) {
                let lights = null;
                let thermostat = null;

                Requests.getLights(room.lightsId)
                .then(data => lights = data)
                .then(() => Requests.getThermostat(room.thermostatId))
                .then(data => thermostat = data)
                .then(() => {
                    res.render("detail", {
                        rooms: rooms, 
                        selectedRoom: room,
                        thermostat: thermostat,
                        lights: lights
                    });
                });

            }
        }
    });
});

app.get("/rooms/:id/values", (req, res) => {
    Room.findOne({_id: req.params.id}, (err, room) => {
        let temp = 0;
        let consumption = 0;
        
        Requests.getLights(room.lightsId)
        .then(lights => {
            consumption += Math.round(lights.consumption * lights.time / 60);
        })
        .then(() => Requests.getThermostat(room.thermostatId))
        .then(thermostat => {
            temp = thermostat.currentTemp;
            consumption += thermostat.consumption;
        })
        .then(() => {
            res.json({"temp": temp, "consumption": consumption});
        });
    });
});

app.get("/statistics", (req, res) => {
    Room.find({}, (err, rooms) => {
        if (err) {
            console.log(err);
        } else {
            res.render("statistics.ejs", {
                rooms: rooms
            });
        }
    });
});

app.post("/rooms", (req, res) => {
    let newLightsId = -1; 
    let newThermostatId = -1;

    Requests.newLights()
    .then(id => newLightsId = id)
    .then(() => Requests.newThermostat())
    .then(id => newThermostatId = id)
    .then(() => {
        Room.create({
            name: 'Nová místnost',
            thermostatId: newThermostatId,
            lightsId: newLightsId
        }).then(newRoom => {
    
            res.json({"id": newRoom._id.toString()});
        })
    });
}) 

app.delete("/rooms/:id", (req, res) => {
    Room.findOne({_id: req.params.id}, (err, room) => {
        Requests.deleteLights(room.lightsId)
        .then(() => Requests.deleteThermostat(room.thermostatId))
        .then(() => Room.deleteOne(room))
        .then(() => res.sendStatus(200));
    });
});

app.put("/rooms/:id", (req, res) => {
    Room.findOne({_id: req.params.id}, (err, room) => {
        const lightsId = room.lightsId;
        const thermostatId = room.thermostatId;
        const type = req.body.type;
        
        if (typeof type == "string") {
            switch (type) {
                case "lightsOn": 
                    Requests.setLights(lightsId, true);  
                    break;
                case "lightsOff": 
                    Requests.setLights(lightsId, false); 
                    break; 
                case "thermostatOn": 
                    Requests.setThermostat(thermostatId, true); 
                    break;
                case "thermostatOff": 
                    Requests.setThermostat(thermostatId, false);
                    break;
                case "setThermostatTemp":
                    Requests.setThermostatTemp(thermostatId, req.body.value);    
                    break;
                case "newName":
                    room.name = req.body.value;
                    room.save();
                    break;
            }
        }

        res.sendStatus(200);
    });
});

app.listen(8000, () => {
    console.log("Listening on port 8000...");
});