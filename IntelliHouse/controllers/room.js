const Room = require("../models/room");
const devicesApi = require('../scripts/devices-api');

setInterval(devicesApi.updateAllDevices, 1000);

exports.index = function(req, res) {
    res.render("index");
};

exports.room_list = function(req, res) {
    Room.find({})
    .then(rooms => {
        res.render("rooms", {rooms: rooms})
    });
};

exports.room_detail = function(req, res) {
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
};

exports.room_detail_values = function(req, res) {
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
};

exports.room_statistics = function(req, res) {
    Room.find({})
    .then(rooms => {
        res.render("statistics.ejs", {
            rooms: rooms
        });
    });
};

exports.room_create = function(req, res) {
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
};

exports.room_delete = function(req, res) {
    Room.findOne({_id: req.params.id})
    .then(room => {
        devicesApi.deleteLights(room.lightsId)
        .then(() => devicesApi.deleteThermostat(room.thermostatId))
        .then(() => Room.deleteOne(room))
        .then(() => res.sendStatus(200));
    });
};

exports.room_update = function(req, res) {
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
};