const fetch = require("node-fetch");

const API_URL = 'http://localhost:3000';

exports.newLight = function() {
    return fetch(API_URL + "/lights", {
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
    .then(data => data.id)
    .catch(err => console.log("API - Creating a new light failed"));
}

exports.newThermostat = function() {
    return fetch(API_URL + "/thermostats", {
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
    .then(data => data.id)
    .catch(err => console.log("API - Creating a new thermostat failed"));
}

exports.getLight = function(id) {
    return fetch(API_URL + `/lights/${id}`, {
        method: "GET"
    })
    .then(res => res.json());
}

exports.getThermostat = function(id) {
    return fetch(API_URL + `/thermostats/${id}`, {
        method: "GET"
    })
    .then(res => res.json());
}

exports.deleteLight = function(id) {
    return fetch(API_URL + `/lights/${id}`, {
        method: "DELETE"
    })
    .catch(err => console.log("API - Deleting a light failed"));
}

exports.deleteThermostat = function(id) {
    return fetch(API_URL + `/thermostats/${id}`, {
        method: "DELETE"
    })
    .catch(err => console.log("API - Deleting a thermostat failed"));
}

exports.setLight = function(id, ison) {
    return fetch(API_URL + `/lights/${id}/ison`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isOn: ison
        })
    })
    .catch(err => console.log("API - Turning a light on/off failed"));
}

exports.setThermostat = function(id, ison) {
    return fetch(API_URL + `/thermostats/${id}/ison`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isOn: ison
        })
    })
    .catch(err => console.log("API - Turning a thermostat on/off failed"));
}

exports.setThermostatTemp = function(id, temp) {
    return fetch(API_URL + `/thermostats/${id}/heatingtemp`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            heatingTemp: temp
        })
    })
    .catch(err => console.log("API - Setting thermostat's heating temp failed"));
}

updateLights = function() {
    return fetch(API_URL + `/lights`, {
        method: "PUT"
    });
}

updateThermostats = function() {
    return fetch(API_URL + `/thermostats`, {
        method: "PUT"
    });
}

exports.updateDevices = function() {
    return new Promise(resolve => {
        Promise.all([
            updateLights(),
            updateThermostats()
        ])
        .then(resolve)
        .catch(err => console.log("API - Updating devices for simulation failed"));
    });
}