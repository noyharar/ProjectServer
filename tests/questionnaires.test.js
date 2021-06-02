const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const {beforeEach, it, afterAll, afterEach, expect, describe} = require("@jest/globals");
const User = require('../modules/User');
const service = require('../service.js');

require('dotenv').config();
const supertest = require('supertest');
let app;
let request;
const userIdHash = service.hashElement("UserID");
var Questionnaire = require('../modules/Questionnaire').Questionnaire;
var QuestionnaireEnglish = require('../modules/Questionnaire').QuestionnaireEnglish;

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
    const questionnaireToCreate = new Questionnaire({
        QuestionnaireID : 0,
        QuestionnaireText : "יומי",
        QuestionnaireEnglishText : "Daily",
        Questions : [
            {
                QuestionID : 0,
                QuestionText:"מהי רמת הכאב המקסימלית שחווית היום?",
                Type:"VAS",
                Best:"אין כאב בכלל",
                Worst:"כאב בלתי נסבל",
                Answers:
                    [
                        {
                            answerID: 0,
                            answerText: "0"
                        },
                        {
                            answerID: 1,
                            answerText: "1"
                        },
                        {
                            answerID: 2,
                            answerText: "2"
                        },
                        {
                            answerID: 3,
                            answerText: "3"
                        },
                        {
                            answerID: 4,
                            answerText: "4"
                        },
                        {
                            answerID: 5,
                            answerText: "5"
                        },
                        {
                            answerID: 6,
                            answerText: "6"
                        },
                        {
                            answerID: 7,
                            answerText: "7"
                        },
                        {
                            answerID: 8,
                            answerText: "8"
                        },
                        {
                            answerID: 9,
                            answerText: "9"
                        },
                        {
                            answerID: 10,
                            answerText: "10"
                        }
                    ]
            },
            {
                QuestionID : 1,
                QuestionText:"איזה סוג תרופה נטלת היום?",
                Type:"multi",
                Alone : [0],
                Answers :
                    [
                        {
                            answerID: 0,
                            answerText: "לא נטלתי"
                        },
                        {	answerID : 1,
                            answerText : "בסיסית"
                        },
                        {	answerID : 2,
                            answerText : "מתקדמת"
                        },
                        {	answerID : 3,
                            answerText : "נרקוטית"
                        }
                    ]
            }
        ]
    });
    Questionnaire.createQuestionnaire(questionnaireToCreate, (err, createdQuestionnaire) => {
        QuestionnaireEnglish.createQuestionnaireEnglish(questionnaireToCreate, (err, createdQuestionnaire) => {
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
 * Questionnaires test suite.
 */
describe('questionnaire tests ', () => {
    it('get Questionnaire by id', (done) => {
        request.get('/questionnaires/getQuestionnaire/0')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text)
                console.log(res.text)
                expect(obj.error).toBeFalsy();
                expect(obj.data.QuestionnaireID).toEqual(0);
                expect(obj.data.QuestionnaireText).toEqual("יומי");
                done();
            });
    });
    it('get all Questionnaires', (done) => {
        request.get('/questionnaires/all')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text)
                console.log(res.text)
                expect(obj.error).toBeFalsy();
                expect(obj.data[0].QuestionnaireID).toEqual(0);
                expect(obj.data[0].QuestionnaireText).toEqual("יומי");
                done();
            });
    });

    it('get Questionnaire by id - NOT english', (done) => {
        request.get('/questionnaires/getQuestionnaire/0/iw')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text)
                console.log(res.text)
                expect(obj.error).toBeFalsy();
                expect(obj.data.QuestionnaireID).toEqual(0);
                expect(obj.data.QuestionnaireText).toEqual("יומי");
                done();
            });
    });
    it('get all Questionnaires - NOT english', (done) => {
        request.get('/questionnaires/all/iw')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text)
                console.log(res.text)
                expect(obj.error).toBeFalsy();
                expect(obj.data[0].QuestionnaireID).toEqual(0);
                expect(obj.data[0].QuestionnaireText).toEqual("יומי");
                done();
            });
    });
    it('get Questionnaire by id - english', (done) => {
        request.get('/questionnaires/getQuestionnaire/0/en')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text)
                console.log(res.text)
                expect(obj.error).toBeFalsy();
                expect(obj.data).toEqual(null);
                // expect(obj.data.QuestionnaireText).toEqual("יומי");
                done();
            });
    });
    it('get all Questionnaires - english', (done) => {
        request.get('/questionnaires/all/en')
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text)
                console.log(res.text)
                expect(obj.error).toBeFalsy();
                // expect(obj.data[0].QuestionnaireID).toEqual(0);
                expect(obj.data.length).toEqual(0);
                done();
            });
    });
});