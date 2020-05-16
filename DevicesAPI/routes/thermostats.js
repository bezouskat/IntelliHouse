const thermostatsRoutes = (app, readFile, writeFile) => {

    const devicesName = 'thermostats';
    const dataPath = `./data/${devicesName}.json`;

    /**
     * updates only the is on status
     */
    app.put(`/${devicesName}/:id/ison`, (req, res) => {
        readFile(dataPath, res, devices => {
            const id = parseInt(req.params.id);

            for (let i = 0; i < devices.length; i++) {
                if (devices[i].id == id) {
                    devices[i].isOn = req.body.isOn;

                    writeFile(dataPath, JSON.stringify(devices), res, () => {
                        return res.status(200).send('Device updated');
                    });
                }
            }
        });
    });

    /**
     * updates only the heating temp status
     */
    app.put(`/${devicesName}/:id/heatingtemp`, (req, res) => {
        readFile(dataPath, res, devices => {
            const id = parseInt(req.params.id);

            for (let i = 0; i < devices.length; i++) {
                if (devices[i].id == id) {
                    devices[i].heatingTemp = req.body.heatingTemp;

                    writeFile(dataPath, JSON.stringify(devices), res, () => {
                        return res.status(200).send('Device updated');
                    });
                }
            }
        });
    });

    function getNewCurrentTemp(currentTemp, heatingTemp, isOn) {
        let newCurrentTemp = currentTemp;
                
        if (isOn) {
            newCurrentTemp = heatingTemp;
        }

        if (Math.random() < 0.2) {
            newCurrentTemp += Math.random() < 0.5 ? -2 : 2;
        }
        else if (Math.random() < 0.5) {
            newCurrentTemp += Math.random() < 0.5 ? -1 : 1;
        }

        if (newCurrentTemp < 0) {
            newCurrentTemp = 0;
        } 
        else if (newCurrentTemp > 30) {
            newCurrentTemp = 30;
        }

        return newCurrentTemp;
    }

    function getNewConsumption(currentTemp, previousTemp, isOn) {
        let newConsumption = 0;

        if (isOn) {
            const tempDiff = Math.abs(currentTemp - previousTemp);

            newConsumption = tempDiff * 80 + 50;
        }

        return newConsumption;
    }

    /**
     * changes data of every thermostat for simulation purposes
     */
    app.put(`/${devicesName}`, (req, res) => {
        readFile(dataPath, res, devices => {
            
            for (let i = 0; i < devices.length; i++) {
                const newCurrentTemp = getNewCurrentTemp(devices[i].currentTemp,
                                                    devices[i].heatingTemp,
                                                    devices[i].isOn);

                const newConsumption = getNewConsumption(newCurrentTemp,
                                                    devices[i].currentTemp,
                                                    devices[i].isOn);

                devices[i].currentTemp = newCurrentTemp;
                devices[i].consumption = newConsumption;
            }

            writeFile(dataPath, JSON.stringify(devices), res, () => {
                res.status(200).send('Data generated successfully');
            });
        });
    });

    const devicesRoutesBasicTemplate = require('./template.js');
    
    devicesRoutesBasicTemplate(app, devicesName, readFile, writeFile);
};

module.exports = thermostatsRoutes;