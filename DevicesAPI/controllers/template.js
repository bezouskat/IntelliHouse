const devicesControllerBasicTemplate = (app, devicesName, readFile, writeFile) => {

    const dataPath = `./data/${devicesName}.json`;

    app.get(`/${devicesName}`, (req, res) => {
        readFile(dataPath, res, devices => {
            res.json(devices);
        });
    });

    app.get(`/${devicesName}/:id`, (req, res) => {
        readFile(dataPath, res, devices => {
            const id = req.params.id;
            
            for (let i = 0; i < devices.length; i++) {
                if (devices[i].id == id) {
                    res.json(devices[i]);
                    break;
                }
            }
        });
    });

    app.post(`/${devicesName}`, (req, res) => {
        readFile(dataPath, res, devices => {
            const newDeviceId = Date.now();

            req.body.id = newDeviceId;
            devices.push(req.body);

            writeFile(dataPath, JSON.stringify(devices), res, () => {
                res.json({
                    'id': newDeviceId
                });
            });
        });
    });

    app.put(`/${devicesName}/:id`, (req, res) => {
        readFile(dataPath, res, devices => {
            const id = req.params.id;

            for (let i = 0; i < devices.length; i++) {
                if (devices[i].id == id) {
                    devices[i]    = req.body;
                    devices[i].id = id;

                    writeFile(dataPath, JSON.stringify(devices), res, () => {
                        res.status(200).send('Device updated');
                    });
                    break;
                }
            }
        });
    });

    app.delete(`/${devicesName}`, (req, res) => {
        writeFile(dataPath, '[]', res, () => {
            res.status(200).send('All devices deleted');
        });
    });

    app.delete(`/${devicesName}/:id`, (req, res) => {
        readFile(dataPath, res, devices => {
            const id = req.params.id;

            for (let i = 0; i < devices.length; i++) {
                if (devices[i].id == id) {
                    devices.splice(i, 1);

                    writeFile(dataPath, JSON.stringify(devices), res, () => {
                        res.status(200).send('Device deleted');
                    });
                    break;
                }
            }
        });
    });
};

module.exports = devicesControllerBasicTemplate;