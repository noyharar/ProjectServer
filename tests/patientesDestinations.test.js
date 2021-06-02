const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const {beforeAll, it, afterAll, afterEach, expect, describe} = require("@jest/globals");
const User = require('../modules/User');
const service = require('../service.js');
var patientLastDaySteps = require('../modules/Destinations').LastDayPatientSteps;
var patientLastWeekSteps = require('../modules/Destinations').LastWeekPatientStepsSchema;
var StepsMetric = require('../modules/Metrics').StepsMetric;
var common = require('../routes/common');


require('dotenv').config();
const supertest = require('supertest');
let app;
let request;

/**
 * Connect to a new in-memory database before running any tests.
 */
const userIdHash = service.hashElement("UserID");
const patientIdHash = service.hashElement("patientID");


let token;
beforeEach(async (done) => {
    await dbHandler.connect();
    app = require('../app');
    request = supertest(app);
    const newUser = new User({
        UserID: userIdHash,
        Password: service.hashElement("Password"),
        First_Name: "First_Name",
        Last_Name: "Last_Name",
        Phone_Number: "Phone_Number",
        BirthDate: 1620139890041,
        Type: ["doctor"],
        VerificationQuestion: 1,
        VerificationAnswer: 2,
        ValidTime: 1620139890041,
        Timestamp: new Date().getTime(),
    });
    const newUserPatient = new User({
        UserID: patientIdHash,
        Password: service.hashElement("Password"),
        First_Name: "First_Name",
        Last_Name: "Last_Name",
        Phone_Number: "Phone_Number",
        Gender: "נקבה",
        Smoke: "מעשן",
        SurgeryType: "ניתוח מתוכנן",
        Education: "6-9 שנות לימוד",
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
    User.createUser(newUserPatient, () => {
        User.createUser(newUser, () => {
            request.post('/users/login')
                .send({UserID: "patientID", Password: "Password"})
                .expect(200)
                .then(res => {
                    token = res.body.data.token;
                    done();
                });
        });
    });
});

describe('tests patients destinations', () => {
    it('post insertLastWeekSteps', (done) => {
        var LastDayPatientSteps = new patientLastDaySteps({
            UserID: patientIdHash,
            LastDayStepsNumber: 100,
            Timestamp: 1620139890041,
        });
        var LastWeekPatientSteps = new patientLastWeekSteps({
            UserID: patientIdHash,
            CurrentWeekSteps: 30,
            LastWeekStepsNumber: 234,
            WeekNumAfterSurgery: 3,
            Timestamp: 1620139890041,
        });

        request.post('/auth/patients/PatientDestinations/insertLastWeekSteps')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                console.log(res.text)
                let obj = JSON.parse(res.text);
                expect(obj.data.CurrentWeekSteps).toEqual(0);
                expect(obj.data.LastWeekStepsNumber).toEqual(0);
                expect(obj.data.WeekNumAfterSurgery).toEqual(0);
                expect(obj.error).toBeFalsy();
                done();
            });
    });
    it('post insertLastWeekSteps - error true', (done) => {
        var LastDayPatientSteps = new patientLastDaySteps({
            UserID: patientIdHash,
            LastDayStepsNumber: 100,
            Timestamp: 1620139890041,
        });
        var LastWeekPatientSteps = new patientLastWeekSteps({
            UserID: patientIdHash,
            CurrentWeekSteps: 30,
            LastWeekStepsNumber: 234,
            WeekNumAfterSurgery: 3,
            Timestamp: 1620139890041,
        });
        LastWeekPatientSteps.save();
        request.post('/auth/patients/PatientDestinations/insertLastWeekSteps')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                console.log(res.text)
                let obj = JSON.parse(res.text);
                expect(obj.error).toBeTruthy();
                expect(obj.message).toEqual('Initial data exist');
                done();
            });
    });
    it('post insertLastDaySteps', (done) => {
        var LastDayPatientSteps = new patientLastDaySteps({
            UserID: patientIdHash,
            LastDayStepsNumber: 100,
            Timestamp: 1620139890041,
        });
        var LastWeekPatientSteps = new patientLastWeekSteps({
            UserID: patientIdHash,
            CurrentWeekSteps: 30,
            LastWeekStepsNumber: 234,
            WeekNumAfterSurgery: 3,
            Timestamp: 1620139890041,
        });
        request.post('/auth/patients/PatientDestinations/insertLastDaySteps')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                console.log(res.text)
                let obj = JSON.parse(res.text);
                expect(obj.data.LastDayStepsNumber).toEqual(0);
                expect(obj.error).toBeFalsy();
                done();
            });
    });
    it('post insertLastDaySteps', (done) => {
        var LastDayPatientSteps = new patientLastDaySteps({
            UserID: patientIdHash,
            LastDayStepsNumber: 100,
            Timestamp: 1620139890041,
        });
        var LastWeekPatientSteps = new patientLastWeekSteps({
            UserID: patientIdHash,
            CurrentWeekSteps: 30,
            LastWeekStepsNumber: 234,
            WeekNumAfterSurgery: 3,
            Timestamp: 1620139890041,
        });
        LastDayPatientSteps.save()
        request.post('/auth/patients/PatientDestinations/insertLastDaySteps')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                console.log(res.text)
                let obj = JSON.parse(res.text);
                expect(obj.error).toBeTruthy();
                done();
            });
    });

    it('get checkPatientProgress', (done) => {
        let newMetric = new StepsMetric({
            UserID: patientIdHash,
            Timestamp: '1585687872507',
            ValidTime: '1585687872507',
            Data: 100
        });
        var patientLastDayStepss = new patientLastDaySteps({
            UserID: patientIdHash,
            LastDayStepsNumber: 100,
            Timestamp: 1585687872508,
        });
        var LastWeekPatientSteps = new patientLastWeekSteps({
            UserID: patientIdHash,
            CurrentWeekSteps: 30,
            LastWeekStepsNumber: 234,
            WeekNumAfterSurgery: 3,
            Timestamp: 1620139890041,
        });
        LastWeekPatientSteps.save(function (error) {
            patientLastDayStepss.save(function (error) {
                newMetric.save(function (error) {
                    request.get('/auth/patients/PatientDestinations/checkPatientProgress')
                        .set('Content-Type', 'application/json')
                        .set('x-auth-token', token)
                        .then(res => {
                            console.log(res.text)
                            let obj = JSON.parse(res.text);
                            expect(obj.data.LastWeekStepsNumber).toEqual(234);
                            expect(obj.data.currentWeekSteps).toEqual(130);
                            expect(obj.data.alertsType).toEqual('Weekly');
                            done();
                        });
                });
            });
        });
    })
})
/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());