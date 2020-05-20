const fetch = require("node-fetch");

exports.newLight = function() {
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

exports.newThermostat = function() {
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

exports.getLight = function(id) {
    return fetch(`http://localhost:3001/lights/${id}`, {
        method: "GET"
    })
    .then(res => res.json());
}

exports.getThermostat = function(id) {
    return fetch(`http://localhost:3001/thermostats/${id}`, {
        method: "GET"
    })
    .then(res => res.json());
}

exports.deleteLight = function(id) {
    return fetch(`http://localhost:3001/lights/${id}`, {
        method: "DELETE"
    });
}

exports.deleteThermostat = function(id) {
    return fetch(`http://localhost:3001/thermostats/${id}`, {
        method: "DELETE"
    });
}

exports.setLight = function(id, ison) {
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

exports.setThermostat = function(id, ison) {
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

exports.setThermostatTemp = function(id, temp) {
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

updateLights = function() {
    return fetch(`http://localhost:3001/lights`, {
        method: "PUT"
    });
}

updateThermostats = function() {
    return fetch(`http://localhost:3001/thermostats`, {
        method: "PUT"
    });
}

exports.updateDevices = function() {
    return new Promise(resolve => {
        Promise.all([
            updateLights(),
            updateThermostats()
        ])
        .then(resolve);
    });
}