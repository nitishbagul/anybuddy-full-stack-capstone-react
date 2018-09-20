const {
    app,
    runServer,
    closeServer
} = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
var expect = chai.expect;

var Events = require('../models/events.js');
const {
    TEST_DATABASE_URL
} = require('../config');

var should = chai.should();

chai.use(chaiHttp);

function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

function seedEventsData() {
    console.info('seeding Events data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            ownerId: "1234",
            ownerName: faker.name.firstName(),
            ownerEmail: faker.internet.email(),
            ownerPhone: faker.phone.phoneNumber(),
            eventTitle: faker.random.words(),
            eventDate: faker.date.recent(),
            eventTime: faker.random.word(),
            eventStreetAddress: faker.address.streetAddress(),
            eventCity: faker.address.city(),
            eventState: faker.address.state(),
            eventCountry: faker.address.country(),
            lat: faker.address.latitude(),
            lng: faker.address.longitude(),
            partnersRequired: faker.random.number()
        });
    }
    return Events.insertMany(seedData);
}

//Generate random for a single event
function generateEventsData() {
    return {
        ownerId: "1234",
        ownerName: faker.name.firstName(),
        ownerEmail: faker.internet.email(),
        ownerPhone: faker.phone.phoneNumber(),
        eventTitle: faker.random.words(),
        eventDate: faker.date.recent(),
        eventTime: faker.random.word(),
        eventStreetAddress: faker.address.streetAddress(),
        eventCity: faker.address.city(),
        eventState: faker.address.state(),
        eventCountry: faker.address.country(),
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        partnersRequired: faker.random.number()
    };
}

describe('anybuddy-full-stack-capstone', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedEventsData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
    describe('GET endpoint', function () {

        it('should return all events', function () {
            let res;
            return chai.request(app)
                .get('/events/get/all/1234')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    return Events.count();
                })
                .then(function (count) {
                    expect(res.body.eventsOutput).to.have.a.lengthOf(count);
                });
        });

        it('should return all the events with right fields', function () {
            return chai.request(app)
                .get('/events/get/all/1234')
                .then(function (res) {
                    //console.log(res.body);
                    //Status 200
                    expect(res).to.have.status(200);
                    //Should be a json
                    expect(res).to.be.json;
                    //Should be array
                    expect(res.body.eventsOutput).to.be.a('array');

                    res.body.eventsOutput.forEach(function (event) {
                        expect(event).to.be.a('object');
                        expect(event).to.include.keys('ownerId', 'ownerName', 'ownerEmail', 'ownerPhone', 'eventTitle', 'eventDate', 'eventTime', 'eventStreetAddress', 'eventCity', 'eventState', 'eventCountry', 'lat', 'lng', 'partnersRequired');
                    });
                    resEvent = res.body.eventsOutput[0];
                    return Events.findById(resEvent._id);
                })

                .then(function (event) {
                    expect(resEvent.ownerId).to.equal(event.ownerId);
                    expect(resEvent.ownerName).to.equal(event.ownerName);
                    expect(resEvent.ownerEmail).to.equal(event.ownerEmail);
                    expect(resEvent.ownerPhone).to.equal(event.ownerPhone);
                    expect(resEvent.eventTitle).to.equal(event.eventTitle);
                    //expect(resEvent.eventDate).to.equal(event.eventDate);
                    expect(resEvent.eventTime).to.equal(event.eventTime);
                    expect(resEvent.eventStreetAddress).to.equal(event.eventStreetAddress);
                    expect(resEvent.eventCity).to.equal(event.eventCity);
                    expect(resEvent.eventState).to.equal(event.eventState);
                    expect(resEvent.eventCountry).to.equal(event.eventCountry);
                    expect(resEvent.lat).to.equal(event.lat);
                    expect(resEvent.lng).to.equal(event.lng);
                    expect(resEvent.partnersRequired).to.equal(event.partnersRequired);
                });
        });
    });
    describe('POST endpoint', function () {

        it('should add a new event', function () {
            const newEvent = generateEventsData();

            return chai.request(app)
                .post('/events/create')
                .send(newEvent)
                .then(function (res) {
                    console.log(res.body);
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys('ownerId', 'ownerName', 'ownerEmail', 'ownerPhone', 'eventTitle', 'eventDate', 'eventTime', 'eventStreetAddress', 'eventCity', 'eventState', 'eventCountry', 'lat', 'lng', 'partnersRequired');
                    expect(res.body.ownerId).to.equal(newEvent.ownerId);
                    expect(res.body.ownerName).to.equal(newEvent.ownerName);
                    expect(res.body.ownerEmail).to.equal(newEvent.ownerEmail);
                    expect(res.body.ownerPhone).to.equal(newEvent.ownerPhone);
                    expect(res.body.eventTitle).to.equal(newEvent.eventTitle);
                    expect(res.body.eventTime).to.equal(newEvent.eventTime);
                    expect(res.body.eventStreetAddress).to.equal(newEvent.eventStreetAddress);
                    expect(res.body.eventCity).to.equal(newEvent.eventCity);
                    expect(res.body.eventState).to.equal(newEvent.eventState);
                    expect(res.body.eventCountry).to.equal(newEvent.eventCountry);
                    expect(res.body.lat).to.equal(parseFloat(newEvent.lat));
                    expect(res.body.lng).to.equal(parseFloat(newEvent.lng));
                    expect(res.body.partnersRequired).to.equal(newEvent.partnersRequired);

                    return Events.findById(res.body._id);
                })
                .then(function (event) {
                    expect(event.ownerId).to.equal(newEvent.ownerId);
                    expect(event.ownerName).to.equal(newEvent.ownerName);
                    expect(event.ownerEmail).to.equal(newEvent.ownerEmail);
                    expect(event.ownerPhone).to.equal(newEvent.ownerPhone);
                    expect(event.eventTitle).to.equal(newEvent.eventTitle);
                    expect(event.eventTime).to.equal(newEvent.eventTime);
                    expect(event.eventStreetAddress).to.equal(event.eventStreetAddress);
                    expect(event.eventCity).to.equal(newEvent.eventCity);
                    expect(event.eventState).to.equal(newEvent.eventState);
                    expect(event.eventCountry).to.equal(newEvent.eventCountry);
                    expect(event.lat).to.equal(parseFloat(newEvent.lat));
                    expect(event.lng).to.equal(parseFloat(newEvent.lng));
                    expect(event.partnersRequired).to.equal(newEvent.partnersRequired);
                });
        });

    });

    describe('PUT endpoint', function () {

        it('should update event fields you send over', function () {
            const updateEvent = {
                eventTitle: 'editedTitle',
                eventTime: 'anytime',
                partnersRequired: 4
            };

            return Events
                .findOne()
                .then(function (event) {
                    updateEvent.id = event._id;

                    // make request then inspect it to make sure it reflects
                    // data we sent
                    return chai.request(app)
                        .put(`/event/${event._id}`)
                        .send(updateEvent);
                })
                .then(function (res) {
                    expect(res).to.have.status(204);

                    return Events.findById(updateEvent.id);
                })
                .then(function (eventElement) {
                    expect(eventElement.eventTitle).to.equal(updateEvent.eventTitle);
                    expect(eventElement.eventTime).to.equal(updateEvent.eventTime);
                    expect(eventElement.partnersRequired).to.equal(updateEvent.partnersRequired);
                });
        });
    });
    describe('DELETE endpoint', function () {

        it('delete an event by id', function () {
            let anyEvent;

            return Events
                .findOne()
                .then(function (_resEvent) {
                    anyEvent = _resEvent;
                    return chai.request(app).delete(`/event/${anyEvent._id}`);
                })
                .then(function (res) {
                    expect(res).to.have.status(204);
                    return Events.findById(anyEvent._id);
                })
                .then(function (_resEvent) {
                    expect(_resEvent).to.be.null;
                });

        });
    });
});
