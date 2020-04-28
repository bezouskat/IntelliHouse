const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const devicesApi = require('./devices-api');

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static(__dirname));

mongoose.connect("mongodb://localhost/SWINZ", {
    useNewUrlParser: true, useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);

const Room = require("./models/room");

setInterval(devicesApi.updateAllDevices, 1000);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/rooms", (req, res) => {
    Room.find({})
    .then(rooms => {
        res.render("rooms", {rooms: rooms})
    });
});

app.get("/rooms/:id", (req, res) => {
    Room.find({})
    .then(rooms => {
        for (let room of rooms) {
            if (room._id.toString().localeCompare(req.params.id) == 0) {
                let lights = null;
                let thermostat = null;

                devicesApi.getLights(room.lightsId)
                .then(data => lights = data)
                .then(() => devicesApi.getThermostat(room.thermostatId))
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
    Room.findOne({_id: req.params.id})
    .then((room) => {
        let temp = 0;
        let consumption = 0;
        
        devicesApi.getLights(room.lightsId)
        .then(lights => {
            if (lights) {
                consumption += Math.round(lights.consumption * lights.time / 60);
            }
        })
        .then(() => devicesApi.getThermostat(room.thermostatId))
        .then(thermostat => {
            if (thermostat) {
                temp = thermostat.currentTemp;
                consumption += thermostat.consumption;
            }
        })
        .then(() => {
            res.json({"temp": temp, "consumption": consumption});
        });
    });
});

app.get("/statistics", (req, res) => {
    Room.find({})
    .then(rooms => {
        res.render("statistics.ejs", {
            rooms: rooms
        });
    });
});

app.post("/rooms", (req, res) => {
    let newLightsId = -1; 
    let newThermostatId = -1;

    devicesApi.newLights()
    .then(id => newLightsId = id)
    .then(() => devicesApi.newThermostat())
    .then(id => newThermostatId = id)
    .then(() => {
        Room.create({
            name: 'Nová místnost',
            thermostatId: newThermostatId,
            lightsId: newLightsId
        })
        .then(newRoom => {
            res.json({"id": newRoom._id.toString()});
        })
    });
}) 

app.delete("/rooms/:id", (req, res) => {
    Room.findOne({_id: req.params.id})
    .then(room => {
        devicesApi.deleteLights(room.lightsId)
        .then(() => devicesApi.deleteThermostat(room.thermostatId))
        .then(() => Room.deleteOne(room))
        .then(() => res.sendStatus(200));
    });
});

app.put("/rooms/:id", (req, res) => {
    Room.findOne({_id: req.params.id})
    .then(room => {
        const lightsId = room.lightsId;
        const thermostatId = room.thermostatId;
        
        switch (req.body.type) {
            case "lightsOn": 
                devicesApi.setLights(lightsId, true);  
                break;
            case "lightsOff": 
                devicesApi.setLights(lightsId, false); 
                break; 
            case "thermostatOn": 
                devicesApi.setThermostat(thermostatId, true); 
                break;
            case "thermostatOff": 
                devicesApi.setThermostat(thermostatId, false);
                break;
            case "setThermostatTemp":
                devicesApi.setThermostatTemp(thermostatId, req.body.value);    
                break;
            case "newName":
                room.name = req.body.value;
                room.save();
                break;
            }

        res.sendStatus(200);
    });
});

app.listen(8000, () => {
    console.log("Listening on port 8000...");
});