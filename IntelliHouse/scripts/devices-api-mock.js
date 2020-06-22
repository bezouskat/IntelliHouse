const api = require('./devices-api.js');

const mock_api = () => {
    api.newLight = () => {
        return new Promise(resolve => {
            resolve(5);
        });
    }
    
    api.newThermostat = () => {
        return new Promise(resolve => {
            resolve(5);
        });
    }
    
    api.getLight = (id) => {
        return new Promise(resolve => {
            resolve({
                "isOn": false,
                "time": 0,
                "consumption": 0,
                "id": 5
            });
        });
    }
    
    api.getThermostat = (id) => {
        return new Promise(resolve => {
            resolve({
                "isOn": false,
                "heatingTemp": 20,
                "currentTemp": 21,
                "consumption": 0,
                "id": 5
            });
        });
    }
    
    api.deleteLight = (id) => {
        return new Promise(resolve => {
            resolve();
        });
    }
    
    api.deleteThermostat = (id) => {
        return new Promise(resolve => {
            resolve();
        });
    }
    
    api.setLight = () => {
        return new Promise(resolve => {
            resolve();
        });
    }
    
    api.setThermostat = () => {
        return new Promise(resolve => {
            resolve();
        });
    }
    
    api.setThermostatTemp = () => {
        return new Promise(resolve => {
            resolve();
        });
    }
    
    api.updateDevices = () => {
        return new Promise(resolve => {
            resolve();
        });
    }    
}

exports.mock_api = mock_api; 