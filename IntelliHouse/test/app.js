process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app.js');
const db = require('../db.js');

describe('App - REST API unit tests:', () => {

    before((done) => {
        db.connect()
        .then(() => done())
        .catch((err) => done(err));
    });

    after((done) => {
        db.close()
        .then(() => done())
        .catch((err) => done(err));
    });

    it('GET /rooms', (done) => {
        request(app)
        .get('/rooms')
        .expect(200)
        .then(() => done());
    });
});