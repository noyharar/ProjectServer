const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const {beforeAll, it, afterAll, afterEach, expect, describe} = require("@jest/globals");
const User = require('../modules/User');
const service = require('../service.js');
var DailyAnswer = require('../modules/Answer').DailyAnswer;
var PeriodicAnswer = require('../modules/Answer').PeriodicAnswer;

require('dotenv').config();
const supertest = require('supertest');
let app;
let request;

/**
 * Connect to a new in-memory database before running any tests.
 */
const userIdHash = service.hashElement("UserID");
const patientIdHash = service.hashElement("patientID");
console.log(userIdHash)
console.log(patientIdHash)

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
        Questionnaires: [          {
            "QuestionnaireID": 3,
            "QuestionnaireText": "תפקוד גף תחתון"
        }],
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
                .send({UserID: "UserID", Password: "Password"})
                .expect(200)
                .then(res => {
                    token = res.body.data.token;
                    done();
                });
        });
    });
});

describe('tests doctors answers', () => {
    it('Get getDailyAnswers', (done) => {
        let newMetric = new DailyAnswer({
            UserID: patientIdHash,
            Timestamp: '1585687850376',
            ValidTime: '1585687872508',
            QuestionnaireID: 0,
            Answers: [
                {
                    QuestionID: 0,
                    AnswerID: [1]
                }
            ]
        });
        newMetric.save(function (error) {
            expect(error).toBeNull();
            const query = {
                UserID: patientIdHash,
                start_time: '1577836800000',
                end_time: '1596326400000'
            };
            request.get('/auth/doctors/answers/getDailyAnswers')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .query(query)
                .then(res => {
                    let obj = JSON.parse(res.text)
                    console.log(res.text)
                    expect(obj.data[0].UserID.UserID).toEqual(patientIdHash);
                    expect(obj.data[0].docs[0].QuestionnaireID).toEqual(0);
                    expect(obj.data[0].docs[0].Answers[0].QuestionID).toEqual(0);
                    expect(obj.data[0].docs[0].Answers[0].AnswerID[0]).toEqual(1);
                    done();
                });
        });
    })
    it('Get getDailyAnswers no docs', (done) => {
            const query = {
                UserID: patientIdHash,
                start_time: '1577836800000',
                end_time: '1596326400000'
            };
            request.get('/auth/doctors/answers/getDailyAnswers')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .query(query)
                .then(res => {
                    let obj = JSON.parse(res.text)
                    console.log(res.text)
                    expect(obj.data[0].UserID.UserID).toEqual(patientIdHash);
                    expect(obj.data[0].docs.length).toEqual(0);
                    done();
                });
    })
    it('Get getDailyAnswers - undefined start time', (done) => {
        let newMetric = new DailyAnswer({
            UserID: patientIdHash,
            Timestamp: '1585687850376',
            ValidTime: '1585687872508',
            QuestionnaireID: 0,
            Answers: [
                {
                    QuestionID: 0,
                    AnswerID: [1]
                }
            ]
        });
        newMetric.save(function (error) {
            expect(error).toBeNull();
            const query = {
                UserID: patientIdHash,
                start_time: undefined,
                end_time: '1596326400000'
            };
            request.get('/auth/doctors/answers/getDailyAnswers')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .query(query)
                .then(res => {
                    let obj = JSON.parse(res.text)
                    console.log(res.text)
                    expect(obj.data[0].UserID.UserID).toEqual(patientIdHash);
                    expect(obj.data[0].docs[0].QuestionnaireID).toEqual(0);
                    expect(obj.data[0].docs[0].Answers[0].QuestionID).toEqual(0);
                    expect(obj.data[0].docs[0].Answers[0].AnswerID[0]).toEqual(1);
                    done();
                });
        });
    })

    it('Get getDailyAnswers - undefined end time', (done) => {
        let newMetric = new DailyAnswer({
            UserID: patientIdHash,
            Timestamp: '1585687850376',
            ValidTime: '1585687872508',
            QuestionnaireID: 0,
            Answers: [
                {
                    QuestionID: 0,
                    AnswerID: [1]
                }
            ]
        });
        newMetric.save(function (error) {
            expect(error).toBeNull();
            const query = {
                UserID: patientIdHash,
                start_time: '1577836800000',
                end_time: undefined
            };
            request.get('/auth/doctors/answers/getDailyAnswers')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .query(query)
                .then(res => {
                    let obj = JSON.parse(res.text)
                    console.log(res.text)
                    expect(obj.data[0].UserID.UserID).toEqual(patientIdHash);
                    expect(obj.data[0].docs[0].QuestionnaireID).toEqual(0);
                    expect(obj.data[0].docs[0].Answers[0].QuestionID).toEqual(0);
                    expect(obj.data[0].docs[0].Answers[0].AnswerID[0]).toEqual(1);
                    done();
                });
        });
    })


    it('Get getPeriodicAnswer', (done) => {
        let newMetric = new PeriodicAnswer({
            UserID: patientIdHash,
            Timestamp: '1585687850376',
            ValidTime: '1585687850376',
            QuestionnaireID: 3,
            Answers: [
                {
                    QuestionID: 0,
                    AnswerID: [1]
                }
            ],
            Score: 123
        });
        newMetric.save(function (error) {
            expect(error).toBeNull();
            const query = {
                UserID: patientIdHash,
                start_time: '1577836800000',
                end_time: '1596326400000'
            };
            request.get('/auth/doctors/answers/getPeriodicAnswers')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .query(query)
                .then(res => {
                    let obj = JSON.parse(res.text)
                    console.log(res.text)
                    expect(obj.data[0].UserID.UserID).toEqual(patientIdHash);
                    expect(obj.data[0].docs.QuestionnaireID).toEqual(3);
                    expect(obj.data[0].docs.data[0].Answers[0].QuestionID).toEqual(0);
                    expect(obj.data[0].docs.data[0].Answers[0].AnswerID[0]).toEqual(1);
                    expect(obj.data[0].docs.data[0].Score).toEqual(123);
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