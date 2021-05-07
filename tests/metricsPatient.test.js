const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const {beforeAll, it, afterAll, afterEach, expect, describe} = require("@jest/globals");
const User = require('../modules/User');
const service = require('../service.js');
const StepsMetric = require('../modules/Metrics').StepsMetric;

require('dotenv').config();
const supertest = require('supertest');
let app;
let request;

/**
 * Connect to a new in-memory database before running any tests.
 */
const userIdHash = service.hashElement("UserID");
let token;
beforeAll(async (done) => {
    await dbHandler.connect();
    app = require('../app');
    request = supertest(app);
    const newUser = new User({
        // UserID: "UserID",
        // Password: "Password",
        UserID: userIdHash,
        Password: service.hashElement("Password"),
        First_Name: "First_Name",
        Last_Name: "Last_Name",
        Phone_Number: "Phone_Number",
        Gender: "Gender",
        Smoke: "Smoke",
        SurgeryType: "SurgeryType",
        Education: "Education",
        Height: 120,
        Weight: 55,
        BMI: "100",
        BMI_NUMBER: 100,
        BirthDate: 1620139890041,
        Type: ["patient"],
        DateOfSurgery: 1620139890041,
        Questionnaires: [],
        VerificationQuestion: 1,
        VerificationAnswer: 2,
        ValidTime: 1620139890041,
        Timestamp: new Date().getTime(),
        changedSurgeryDate: false,
        changedQuestionnaires: false
    });
    User.createUser(newUser, () => {
        request.post('/users/login')
            .send({UserID: "UserID", Password: "Password"})
            .expect(200)
            .then(res => {
                token = res.body.data.token;
                done();
            });
    });
});

describe('tests', () => {
   it('expect', (done) => {
       let newMetric = new StepsMetric({
           UserID: userIdHash,
           Timestamp: 1585687850376,
           ValidTime: 1585687872508,
           Data: 100
       });
       newMetric.save(function (error) {
           expect(error).toBeNull();
           const query = {
               start_time: '1577836800000',
               end_time: '1596326400000'
           };
           request.get('/auth/patients/metrics/getSteps')
               .set('Content-Type', 'application/json')
               .set('x-auth-token', token)
               .query(query)
               .then(res => {
                   expect(res).toBeTruthy();
                   done();
               });
       });
   })
});
/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());