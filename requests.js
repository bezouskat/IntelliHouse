const fetch = require("node-fetch");

function newLights() {
    return fetch("http://localhost:3001/lights", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isOn: false,
            time: 0,
            consumption: 0
        })
    })
    .then(res => res.json())
    .then(data => data.id);
}

exports.newLights = newLights;

function newThermostat() {
    return fetch("http://localhost:3001/thermostats", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isOn: false,
            heatingTemp: 20,
            currentTemp: 20,
            consumption: 0
        })
    })
    .then(res => res.json())
    .then(data => data.id);
}

exports.newThermostat = newThermostat;

function getLights(id) {
    return fetch(`http://localhost:3001/lights/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json());
}

exports.getLights = getLights;

function getThermostat(id) {
    return fetch(`http://localhost:3001/thermostats/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json());
}

exports.getThermostat = getThermostat;

function deleteLights(id) {
    return fetch(`http://localhost:3001/lights/${id}`, {
        method: "DELETE"
    });
}

exports.deleteLights = deleteLights;

function deleteThermostat(id) {
    return fetch(`http://localhost:3001/thermostats/${id}`, {
        method: "DELETE"
    });
}

exports.deleteThermostat = deleteThermostat;

function setLights(id, ison) {
    return fetch(`http://localhost:3001/lights/${id}/ison`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isOn: ison
        })
    });
}

exports.setLights = setLights;

function setThermostat(id, ison) {
    return fetch(`http://localhost:3001/thermostats/${id}/ison`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isOn: ison
        })
    });
}

exports.setThermostat = setThermostat;

function setThermostatTemp(id, temp) {
    return fetch(`http://localhost:3001/thermostats/${id}/heatingtemp`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            heatingTemp: temp
        })
    });
}

exports.setThermostatTemp = setThermostatTemp;

function updateAllDevices() {
    return fetch(`http://localhost:3001/lights`, {
        method: "PUT"
    })
    .then(() => fetch(`http://localhost:3001/thermostats`, {
        method: "PUT"
    }));
}

exports.updateAllDevices = updateAllDevices;