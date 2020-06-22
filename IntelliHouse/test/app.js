process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app.js');
const db = require('../db.js');
const api = require('../scripts/devices-api-mock.js');

describe('App - REST API unit tests:', () => {

    before((done) => {
        db.connect()
        .then(() => {
            
            api.mock_api();

            done();
        })
        .catch((err) => done(err));
    });

    after((done) => {
        db.close()
        .then(() => done())
        .catch((err) => done(err));
    });

    it('GET /', (done) => {
        request(app)
        .get('/')
        .expect(200)
        .then(() => done())
        .catch(err => done(err));
    });

    it('GET /rooms', (done) => {
        request(app)
        .get('/rooms')
        .expect(200)
        .then(() => done())
        .catch(err => done(err));
    });

    let id = -1;

    it('POST /rooms', (done) => {
        request(app)
        .post('/rooms')
        .expect(200)
        .then((res) => {
            expect(res.body).to.contain.property('id');
            id = res.body.id;
        })
        .then(() => done())
        .catch(err => done(err));
    });

    it('GET /rooms/:id', (done) => {
        request(app)
        .get('/rooms/' + id)
        .expect(200)
        .then(() => done())
        .catch(err => done(err));
    });

    it('GET /rooms/:id/values', (done) => {
        request(app)
        .get('/rooms/' + id + '/values')
        .expect(200)
        .then((res) => {
            expect(res.body).to.contain.property('temp');
            expect(res.body).to.contain.property('consumption');
        })
        .then(() => done())
        .catch(err => done(err));
    });

    it('PUT /rooms/:id', (done) => {
        request(app)
        .put('/rooms/' + id)
        .send({ type: 'lightsOn'})
        .expect(200)
        .then(() => done())
        .catch(err => done(err));
    });

    it('DELETE /rooms/:id', (done) => {
        request(app)
        .delete('/rooms/' + id)
        .expect(200)
        .then(() => done())
        .catch(err => done(err));
    });

    it('GET /statistics', (done) => {
        request(app)
        .get('/statistics')
        .expect(200)
        .then(() => done())
        .catch(err => done(err));
    });
});