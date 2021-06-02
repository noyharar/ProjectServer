const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const {beforeAll, it, afterAll, afterEach, expect, describe} = require("@jest/globals");
const User = require('../modules/User');
const service = require('../service.js');

require('dotenv').config();
const supertest = require('supertest');
let app;
let request;
const userIdHash = service.hashElement("UserID");
const Exercise = require('../modules/Exercise');
const Instruction = require('../modules/InstructionsSurgery');


/**
 * Connect to a new in-memory database before running any tests.
 */
beforeEach(async (done) => {
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
        changedSurgeryDate: true,
        changedQuestionnaires: true
    });
    const exerciseToCreate = new Exercise({
        ExerciseId: "ExerciseId",
        Category: "Category",
        Video : "Video"
    });
    const newInstruction = new Instruction({
        InstructionId: "InstructionId",
        Title: "Title",
        PdfName: "PdfName",
        Category: "Category"
    });
    Instruction.createInstructionsSurgery(newInstruction,(err, createdInstruction) => {
        Exercise.createExercise(exerciseToCreate, (err, createdExercise) => {
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
});


/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

/**
 * Exercise test suite.
 */
describe('usersAll tests ', () => {
    it('getUserQuestionnaire', (done) => {
        request.get('/auth/usersAll/getUserQuestionnaire')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text)
                console.log(res.text)
                expect(obj.error).toBeFalsy();
                expect(obj.data[0].QuestionnaireID).toEqual(3);
                expect(obj.data[0].QuestionnaireText).toEqual("תפקוד גף תחתון");
                done();
            });
    });

    it('test getChangeWithSurgeryOrQuestionnaires', (done) => {
        request.get('/auth/usersAll/getChangeWithSurgeryOrQuestionnaires')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text)
                console.log(res.text)
                expect(obj.error).toBeFalsy();
                expect(obj.data.changedQuestionnaires).toBeTruthy()
                expect(obj.data.changedSurgeryDate).toBeTruthy()
                done();
            });
    });

    it('test changeUserQuestionnaire', (done) => {
        request.post('/auth/usersAll/changeUserQuestionnaire')
            .send({
                UserID:userIdHash,
                Questionnaires:[
                    {
                        "QuestionnaireID": 1,
                        "QuestionnaireText": "תפקוד גב תחתון"
                    },
                    {
                        "QuestionnaireID": 2,
                        "QuestionnaireText": "תפקוד צוואר"
                    },
                    {
                        "QuestionnaireID": 3,
                        "QuestionnaireText": "תפקוד גף תחתון"
                    },
                    {
                        "QuestionnaireID": 5,
                        "QuestionnaireText": "איכות חיים"
                    },
                    {
                        "QuestionnaireID": 6,
                        "QuestionnaireText": "דירוג איכות חיים"
                    }
                ]})
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .expect(200)
            .then(res => {
                console.log(res.body)
                expect(res.body.error).toBeFalsy();
                expect(res.body.message).toBeNull();
                request.get('/auth/usersAll/getUserQuestionnaire')
                    .set('Content-Type', 'application/json')
                    .set('x-auth-token', token)
                    .then(res => {
                        let obj = JSON.parse(res.text)
                        console.log(res.text)
                        expect(obj.error).toBeFalsy();
                        expect(obj.data.length).toEqual(6);
                        done();

                    });
            });
    });

    it('test getDateOfSurgery', (done) => {
        request.get('/auth/usersAll/getDateOfSurgery')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text)
                console.log(res.text)
                expect(obj.error).toBeFalsy();
                expect(obj.data).toEqual(1620139890041)
                done();
            });
    });

    it('test changeDateOfSurgery', (done) => {
        request.post('/auth/usersAll/changeDateOfSurgery')
            .send({
                UserID:userIdHash, DateOfSurgery:1580382000000})
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .expect(200)
            .then(res => {
                console.log(res.body)
                expect(res.body.error).toBeFalsy();
                expect(res.body.message).toBeNull();
                request.get('/auth/usersAll/getDateOfSurgery')
                    .set('Content-Type', 'application/json')
                    .set('x-auth-token', token)
                    .then(res => {
                        let obj = JSON.parse(res.text)
                        console.log(res.text)
                        expect(obj.error).toBeFalsy();
                        expect(obj.data).toEqual(1580382000000);
                        done();

                    });
            });
    });
    it('test askChangePassword', (done) => {
        request.post('/auth/usersAll/askChangePassword')
            .send({UserID:userIdHash})
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .expect(200)
            .then(res => {
                console.log(res.body)
                expect(res.body.error).toBeFalsy();
                expect(res.body.message).toBeNull();
                done();
            });
    });
    it('test getuserInfo', (done) => {
        request.get('/auth/usersAll/userInfo')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text)
                console.log(res.text)
                expect(obj.error).toBeFalsy();
                expect(obj.data.UserID).toEqual(userIdHash);
                expect(obj.data.First_Name).toEqual("First_Name");
                expect(obj.data.Last_Name).toEqual("Last_Name");
                expect(obj.data.Password).toEqual("588+9PF8OZmpTyxvYS6KiI5bECaHjk4ZOYsjvTjsIho=");
                done();
            });
    });

    it('test patientUpdate', (done) => {
        request.put('/auth/usersAll/patientUpdate')
            .send({
                BMI: "75.75119939399039",
                BirthDate: 636933600000,
                DateOfSurgery: 1618963200000,
                Education: "6-9 שנות לימוד",
                First_Name: "מטופל",
                Gender: "זכר",
                Height: 109,
                Last_Name: "5815492",
                Phone_Number: "",
                Smoke: "מעשן",
                SurgeryType: "ניתוח דחוף",
                ValidTime: 1622570792026,
                Weight: 90})
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .expect(200)
            .then(res => {
                console.log(res.body)
                expect(res.body.error).toBeFalsy();
                expect(res.body.message).toBeNull();
                expect(res.body.data.UserID).toEqual(userIdHash);
                expect(res.body.data.First_Name).toEqual("מטופל");
                expect(res.body.data.Last_Name).toEqual("5815492");
                done()
            });
    });
    it('test patientUpdateAndroid', (done) => {
        request.post('/auth/usersAll/patientUpdateAndroid')
            .send({
                BMI: "75.75119939399039",
                BirthDate: 636933600000,
                DateOfSurgery: 1618963200000,
                Education: "6-9 שנות לימוד",
                First_Name: "מטופל",
                Gender: "זכר",
                Height: 109,
                Last_Name: "5815492",
                Phone_Number: "",
                Smoke: "מעשן",
                SurgeryType: "ניתוח דחוף",
                ValidTime: 1622570792026,
                Weight: 90})
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .expect(200)
            .then(res => {
                console.log(res.body)
                expect(res.body.error).toBeFalsy();
                expect(res.body.message).toBeNull();
                expect(res.body.data.UserID).toEqual(userIdHash);
                expect(res.body.data.First_Name).toEqual("מטופל");
                expect(res.body.data.Last_Name).toEqual("5815492");
                done()
            });
    });


    it('test doctorUpdate', (done) => {
        request.put('/auth/usersAll/doctorUpdate')
            .send({
                BirthDate: 638830800000,
                First_Name: "x",
                Last_Name: "x",
                Phone_Number: "2222233321",
                ValidTime: 1622571545038})
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .expect(200)
            .then(res => {
                console.log(res.body)
                expect(res.body.error).toBeFalsy();
                expect(res.body.message).toBeNull();
                expect(res.body.data.UserID).toEqual(userIdHash);
                expect(res.body.data.First_Name).toEqual("x");
                expect(res.body.data.Last_Name).toEqual("x");
                expect(res.body.data.Phone_Number).toEqual("2222233321");
                done()
            });
    });


    it('test exercises', (done) => {
        request.get('/auth/usersAll/exercises')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text)
                console.log(res.text)
                expect(obj.error).toBeFalsy();
                expect(obj.data.length).toEqual(1);
                expect(obj.data[0].ExerciseId).toEqual("ExerciseId");
                expect(obj.data[0].Category).toEqual("Category");
                expect(obj.data[0].Video).toEqual("Video");
                done();
            });
    });



    it('test instructions', (done) => {
        request.get('/auth/usersAll/instructions')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text)
                console.log(res.text)
                expect(obj.error).toBeFalsy();
                expect(obj.data.length).toEqual(1);
                expect(obj.data[0].InstructionId).toEqual("InstructionId");
                expect(obj.data[0].Title).toEqual("Title");
                expect(obj.data[0].PdfName).toEqual("PdfName");
                expect(obj.data[0].Category).toEqual("Category");
                done();
            });
    });


});