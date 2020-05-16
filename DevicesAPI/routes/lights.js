const lightsRoutes = (app, readFile, writeFile) => {

    const devicesName = 'lights';
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

    function getNewTime(isOn) {
        let time = 0;

        if (isOn) {
            time = Math.floor(Math.random() * 60) + 1;
        }

        return time;
    }

    function getNewConsumption(isOn) {
        let consumption = 0;

        if (isOn) {
            let c1 = Math.floor(Math.random() * 2);
            let c2 = Math.floor(Math.random() * 2);
            let c3 = Math.floor(Math.random() * 2);

            const toss = Math.random();

            if      (toss < 0.33) c1 = 1;
            else if (toss < 0.66) c2 = 1;
            else                  c3 = 1;

            consumption = c1 * 40 + c2 * 60 + c3 * 100;
        }

        return consumption;
    }

    /**
     * changes data of every light for simulation purposes
     */
    app.put(`/${devicesName}`, (req, res) => {
        readFile(dataPath, res, devices => {
            
            for (let i = 0; i < devices.length; i++) {
                const newTime = getNewTime(devices[i].isOn);
                const newConsumption = getNewConsumption(devices[i].isOn);

                devices[i].time = newTime;
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

module.exports = lightsRoutes;