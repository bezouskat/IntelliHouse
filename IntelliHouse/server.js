const app = require('./app.js');
const db = require('./db.js');

const PORT = 8000;

db.connect()
.then(() => {
    app.listen(PORT, () => {
        console.log('Listening on port: ' + PORT);
    });
});