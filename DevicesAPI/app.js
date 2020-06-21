const express    = require('express');
const bodyParser = require('body-parser');
const fs         = require('fs');
const app        = express();

app.use(bodyParser.json());

const readFile = (filePath, res, callback) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(404).send('File not found');
        } else {
            callback(JSON.parse(data));
        }
    });
};

const writeFile = (filePath, fileData, res, callback) => {
    fs.writeFile(filePath, fileData, (err) => {
        if (err) {
            res.status(404).send('File not found');
        } else {
            callback();
        }
    });
};

const lightsController      = require('./controllers/lights.js');
const thermostatsController = require('./controllers/thermostats.js');

lightsController(app, readFile, writeFile);
thermostatsController(app, readFile, writeFile);

const server = app.listen(3000, () => {
    console.log('Listening on port: ' + server.address().port);
});