const Room = require("../models/room");
const Light = require("../models/light");
const Thermostat = require("../models/thermostat");

const devicesApi = require('../scripts/devices-api');

setInterval(devicesApi.updateDevices, 1000);

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
    .then((rooms) => {
        for (let room of rooms) {
            if (room._id.toString().localeCompare(req.params.id) == 0) { 
                Promise.all([
                    devicesApi.getLight(room.light),
                    devicesApi.getThermostat(room.thermostat)
                ])
                .then(devices => {
                    res.render("detail", {
                        rooms: rooms, 
                        selectedRoom: room,
                        light: devices[0],
                        thermostat: devices[1]
                    })
                });
            }
        }
    });
};

exports.room_detail_values = function(req, res) {
    Room.findOne({_id: req.params.id})
    .then(room => {
        Promise.all([
            devicesApi.getLight(room.light),
            devicesApi.getThermostat(room.thermostat)
        ])
        .then(devices => {
            if (devices[0] && devices[1]) {
                const consumption = 
                    Math.round(devices[0].consumption * devices[0].time / 60)
                    + devices[1].consumption;

                const temp = devices[1].currentTemp;
                
                res.json({"temp": temp, "consumption": consumption});
            }
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
    let newLightId = -1; 
    let newThermostatId = -1;

    devicesApi.newLight()
    .then(id => newLightId = id)
    .then(() => devicesApi.newThermostat())
    .then(id => newThermostatId = id)
    .then(() => {
        const newLight = new Light({
            _id: { valueOf: () => newLightId }
        });
        const newThermostat = new Thermostat({
            _id: { valueOf: () => newThermostatId }
        });

        newLight.save();
        newThermostat.save();

        Room.create({
            name: 'Nová místnost',
            light: newLight._id,
            thermostat: newThermostat._id
        })
        .then(newRoom => {
            res.json({"id": newRoom._id.toString()});
        });
    });
};

exports.room_delete = function(req, res) {
    Room.findOne({_id: req.params.id})
    .then(room => {
        devicesApi.deleteLight(room.light)
        .then(() => devicesApi.deleteThermostat(room.thermostat))
        .then(() => Light.deleteOne({_id: room.light}))
        .then(() => Thermostat.deleteOne({_id: room.thermostat}))
        .then(() => Room.deleteOne(room))
        .then(() => res.sendStatus(200));
    });
};

exports.room_update = function(req, res) {
    Room.findOne({_id: req.params.id})
    .then(room => {
        
        switch (req.body.type) {
            case "lightsOn": 
                devicesApi.setLight(room.light, true);  
                break;
            case "lightsOff": 
                devicesApi.setLight(room.light, false); 
                break; 
            case "thermostatOn": 
                devicesApi.setThermostat(room.thermostat, true); 
                break;
            case "thermostatOff": 
                devicesApi.setThermostat(room.thermostat, false);
                break;
            case "setThermostatTemp":
                devicesApi.setThermostatTemp(room.thermostat, req.body.value);    
                break;
            case "newName":
                room.name = req.body.value;
                room.save();
                break;
            }

        res.sendStatus(200);
    });
};