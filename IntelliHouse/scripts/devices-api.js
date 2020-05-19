const fetch = require("node-fetch");

function newLight() {
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

exports.newLight = newLight;

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

function getLight(id) {
    return fetch(`http://localhost:3001/lights/${id}`, {
        method: "GET"
    })
    .then(res => res.json())
    .catch(err => console.log('Failed to find the lights.'));
}

exports.getLight = getLight;

function getThermostat(id) {
    return fetch(`http://localhost:3001/thermostats/${id}`, {
        method: "GET"
    })
    .then(res => res.json())
    .catch(err => console.log('Failed to find the thermostat.'));
}

exports.getThermostat = getThermostat;

function deleteLight(id) {
    return fetch(`http://localhost:3001/lights/${id}`, {
        method: "DELETE"
    });
}

exports.deleteLight = deleteLight;

function deleteThermostat(id) {
    return fetch(`http://localhost:3001/thermostats/${id}`, {
        method: "DELETE"
    });
}

exports.deleteThermostat = deleteThermostat;

function setLight(id, ison) {
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

exports.setLight = setLight;

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