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

const thermostatsRoutes = require('./routes/thermostats.js');
const lightsRoutes      = require('./routes/lights.js');

thermostatsRoutes(app, readFile, writeFile);
lightsRoutes(app, readFile, writeFile);

const server = app.listen(3001, () => {
    console.log('Listening on port: ' + server.address().port);
});