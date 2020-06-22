const mongoose = require('mongoose');
const DB_URI = 'mongodb://localhost/IntelliHouse';

function mongo(resolve, reject) {
    mongoose.connect(DB_URI, {
        useNewUrlParser: true, useUnifiedTopology: true
    })
    .then((res, err) => {
        if (err) return reject(err);
        
        mongoose.set('useFindAndModify', false);
        resolve();
    });
}

function connect() {
    return new Promise((resolve, reject) => {
        
        if (process.env.NODE_ENV === 'test') {
            const Mockgoose = require('mockgoose').Mockgoose;
            const mockgoose = new Mockgoose(mongoose);

            mockgoose.prepareStorage()
            .then(() => {
                mongo(resolve, reject);
            });
        } else {
            mongo(resolve, reject);
        }
    });
}

function close() {
    return mongoose.disconnect();
}

module.exports = { connect, close };