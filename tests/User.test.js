const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const User = require('../modules/User');
const globals = require("@jest/globals");
var service = require('../service.js');

/**
 * Connect to a new in-memory database before running any tests.
 */
globals.beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
globals.afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
globals.afterAll(async () => await dbHandler.closeDatabase());

/**
 * Exercise test suite.
 */
globals.describe('User tests ', () => {
    globals.it('Create User', (done) => {
        const newUser = new User({
            UserID: "UserID",
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
        const callback = (err, createdUser) => {
            globals.expect(err).toBeNull();
            globals.expect(createdUser.UserID).toEqual("UserID");
            globals.expect(createdUser.Password).toEqual(service.hashElement("Password"));
            globals.expect(createdUser.First_Name).toEqual("First_Name");
            globals.expect(createdUser.Last_Name).toEqual("Last_Name");
            globals.expect(createdUser.Phone_Number).toEqual("Phone_Number");
            globals.expect(createdUser.Gender).toEqual("Gender");
            globals.expect(createdUser.Smoke).toEqual("Smoke");
            globals.expect(createdUser.SurgeryType).toEqual("SurgeryType");
            globals.expect(createdUser.Education).toEqual("Education");
            globals.expect(createdUser.Height).toEqual(120);
            globals.expect(createdUser.Weight).toEqual(55);
            globals.expect(createdUser.BMI_NUMBER).toEqual(100);
            globals.expect(createdUser.BMI).toEqual("100");
            globals.expect(createdUser.BirthDate).toEqual(1620139890041);
            globals.expect(createdUser.Type[0]).toEqual("patient");
            globals.expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            globals.expect(createdUser.Questionnaires.length).toEqual(0);
            globals.expect(createdUser.VerificationQuestion).toEqual(1);
            globals.expect(createdUser.VerificationAnswer).toEqual("2");
            globals.expect(createdUser.ValidTime).toEqual(1620139890041);
            done();
        };
        User.createUser(newUser, callback);
    });

    globals.it('Get User By UserID - exists user', (done) => {
        const newUser = new User({
            UserID: "UserID",
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
        User.createUser(newUser, (err,createdUser) => {
            globals.expect(err).toBeNull();
            globals.expect(createdUser.UserID).toEqual("UserID");
            globals.expect(createdUser.Password).toEqual(service.hashElement("Password"));
            globals.expect(createdUser.First_Name).toEqual("First_Name");
            globals.expect(createdUser.Last_Name).toEqual("Last_Name");
            globals.expect(createdUser.Phone_Number).toEqual("Phone_Number");
            globals.expect(createdUser.Gender).toEqual("Gender");
            globals.expect(createdUser.Smoke).toEqual("Smoke");
            globals.expect(createdUser.SurgeryType).toEqual("SurgeryType");
            globals.expect(createdUser.Education).toEqual("Education");
            globals.expect(createdUser.Height).toEqual(120);
            globals.expect(createdUser.Weight).toEqual(55);
            globals.expect(createdUser.BMI_NUMBER).toEqual(100);
            globals.expect(createdUser.BMI).toEqual("100");
            globals.expect(createdUser.BirthDate).toEqual(1620139890041);
            globals.expect(createdUser.Type[0]).toEqual("patient");
            globals.expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            globals.expect(createdUser.Questionnaires.length).toEqual(0);
            globals.expect(createdUser.VerificationQuestion).toEqual(1);
            globals.expect(createdUser.VerificationAnswer).toEqual("2");
            globals.expect(createdUser.ValidTime).toEqual(1620139890041);
            User.getUserByUserID("UserID",(err, user) => {
                globals.expect(err).toBeNull();
                globals.expect(user.UserID).toEqual("UserID");
                globals.expect(user.Password).toEqual(service.hashElement("Password"));
                globals.expect(user.First_Name).toEqual("First_Name");
                globals.expect(user.Last_Name).toEqual("Last_Name");
                globals.expect(user.Phone_Number).toEqual("Phone_Number");
                globals.expect(user.Gender).toEqual("Gender");
                globals.expect(user.Smoke).toEqual("Smoke");
                globals.expect(user.SurgeryType).toEqual("SurgeryType");
                globals.expect(user.Education).toEqual("Education");
                globals.expect(user.Height).toEqual(120);
                globals.expect(user.Weight).toEqual(55);
                globals.expect(user.BMI_NUMBER).toEqual(100);
                globals.expect(user.BMI).toEqual("100");
                globals.expect(user.BirthDate).toEqual(1620139890041);
                globals.expect(user.Type[0]).toEqual("patient");
                globals.expect(user.DateOfSurgery).toEqual(1620139890041);
                globals.expect(user.Questionnaires.length).toEqual(0);
                globals.expect(user.VerificationQuestion).toEqual(1);
                globals.expect(user.VerificationAnswer).toEqual("2");
                globals.expect(user.ValidTime).toEqual(1620139890041);
                done();
            });
        });
    });


    globals.it('Get User By UserID - Not exists user', (done) => {
        const newUser = new User({
            UserID: "UserID",
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
        User.createUser(newUser, (err,createdUser) => {
            globals.expect(err).toBeNull();
            globals.expect(createdUser.UserID).toEqual("UserID");
            globals.expect(createdUser.Password).toEqual(service.hashElement("Password"));
            globals.expect(createdUser.First_Name).toEqual("First_Name");
            globals.expect(createdUser.Last_Name).toEqual("Last_Name");
            globals.expect(createdUser.Phone_Number).toEqual("Phone_Number");
            globals.expect(createdUser.Gender).toEqual("Gender");
            globals.expect(createdUser.Smoke).toEqual("Smoke");
            globals.expect(createdUser.SurgeryType).toEqual("SurgeryType");
            globals.expect(createdUser.Education).toEqual("Education");
            globals.expect(createdUser.Height).toEqual(120);
            globals.expect(createdUser.Weight).toEqual(55);
            globals.expect(createdUser.BMI_NUMBER).toEqual(100);
            globals.expect(createdUser.BMI).toEqual("100");
            globals.expect(createdUser.BirthDate).toEqual(1620139890041);
            globals.expect(createdUser.Type[0]).toEqual("patient");
            globals.expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            globals.expect(createdUser.Questionnaires.length).toEqual(0);
            globals.expect(createdUser.VerificationQuestion).toEqual(1);
            globals.expect(createdUser.VerificationAnswer).toEqual("2");
            globals.expect(createdUser.ValidTime).toEqual(1620139890041);
            User.getUserByUserID("UserIDNotExists",(err, user) => {
                globals.expect(err).toBeNull();
                globals.expect(user).toBeNull();
                done()
            });
        });
    });
    globals.it('Get User By Name - exists user', (done) => {
        const newUser = new User({
            UserID: "UserID",
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
        User.createUser(newUser, (err,createdUser) => {
            globals.expect(err).toBeNull();
            globals.expect(createdUser.UserID).toEqual("UserID");
            globals.expect(createdUser.Password).toEqual(service.hashElement("Password"));
            globals.expect(createdUser.First_Name).toEqual("First_Name");
            globals.expect(createdUser.Last_Name).toEqual("Last_Name");
            globals.expect(createdUser.Phone_Number).toEqual("Phone_Number");
            globals.expect(createdUser.Gender).toEqual("Gender");
            globals.expect(createdUser.Smoke).toEqual("Smoke");
            globals.expect(createdUser.SurgeryType).toEqual("SurgeryType");
            globals.expect(createdUser.Education).toEqual("Education");
            globals.expect(createdUser.Height).toEqual(120);
            globals.expect(createdUser.Weight).toEqual(55);
            globals.expect(createdUser.BMI_NUMBER).toEqual(100);
            globals.expect(createdUser.BMI).toEqual("100");
            globals.expect(createdUser.BirthDate).toEqual(1620139890041);
            globals.expect(createdUser.Type[0]).toEqual("patient");
            globals.expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            globals.expect(createdUser.Questionnaires.length).toEqual(0);
            globals.expect(createdUser.VerificationQuestion).toEqual(1);
            globals.expect(createdUser.VerificationAnswer).toEqual("2");
            globals.expect(createdUser.ValidTime).toEqual(1620139890041);
            User.getUserByName("First_Name","Last_Name",["patient"],(err, user) => {
                globals.expect(err).toBeNull();
                globals.expect(user[0].UserID).toEqual("UserID");
                globals.expect(user[0].Password).toEqual(service.hashElement("Password"));
                globals.expect(user[0].First_Name).toEqual("First_Name");
                globals.expect(user[0].Last_Name).toEqual("Last_Name");
                globals.expect(user[0].Phone_Number).toEqual("Phone_Number");
                globals.expect(user[0].Gender).toEqual("Gender");
                globals.expect(user[0].Smoke).toEqual("Smoke");
                globals.expect(user[0].SurgeryType).toEqual("SurgeryType");
                globals.expect(user[0].Education).toEqual("Education");
                globals.expect(user[0].Height).toEqual(120);
                globals.expect(user[0].Weight).toEqual(55);
                globals.expect(user[0].BMI_NUMBER).toEqual(100);
                globals.expect(user[0].BMI).toEqual("100");
                globals.expect(user[0].BirthDate).toEqual(1620139890041);
                globals.expect(user[0].Type[0]).toEqual("patient");
                globals.expect(user[0].DateOfSurgery).toEqual(1620139890041);
                globals.expect(user[0].Questionnaires.length).toEqual(0);
                globals.expect(user[0].VerificationQuestion).toEqual(1);
                globals.expect(user[0].VerificationAnswer).toEqual("2");
                globals.expect(user[0].ValidTime).toEqual(1620139890041);
                done();
            });
        });
    });
    globals.it('Get User By UserID - Not exists user', (done) => {
        const newUser = new User({
            UserID: "UserID",
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
        User.createUser(newUser, (err,createdUser) => {
            globals.expect(err).toBeNull();
            globals.expect(createdUser.UserID).toEqual("UserID");
            globals.expect(createdUser.Password).toEqual(service.hashElement("Password"));
            globals.expect(createdUser.First_Name).toEqual("First_Name");
            globals.expect(createdUser.Last_Name).toEqual("Last_Name");
            globals.expect(createdUser.Phone_Number).toEqual("Phone_Number");
            globals.expect(createdUser.Gender).toEqual("Gender");
            globals.expect(createdUser.Smoke).toEqual("Smoke");
            globals.expect(createdUser.SurgeryType).toEqual("SurgeryType");
            globals.expect(createdUser.Education).toEqual("Education");
            globals.expect(createdUser.Height).toEqual(120);
            globals.expect(createdUser.Weight).toEqual(55);
            globals.expect(createdUser.BMI_NUMBER).toEqual(100);
            globals.expect(createdUser.BMI).toEqual("100");
            globals.expect(createdUser.BirthDate).toEqual(1620139890041);
            globals.expect(createdUser.Type[0]).toEqual("patient");
            globals.expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            globals.expect(createdUser.Questionnaires.length).toEqual(0);
            globals.expect(createdUser.VerificationQuestion).toEqual(1);
            globals.expect(createdUser.VerificationAnswer).toEqual("2");
            globals.expect(createdUser.ValidTime).toEqual(1620139890041);
            User.getUserByName("UserNotExists","Last_Name","patient", (err, user) => {
                globals.expect(err).toBeNull();
                globals.expect(user.length).toEqual(0);
                done()
            });
        });
    });

    globals.it('Get User By UserID - exists user', (done) => {
        const newUser = new User({
            UserID: "UserID",
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

        const updatedUser = new User({
            First_Name: "First_Name",
            Last_Name: "Last_Name",
            Phone_Number: "Phone_Number",
            Gender: "Gender",
            Smoke: "Smoke",
            SurgeryType: "SurgeryType",
            Education: "Education",
            Height: 180,
            Weight: 66,
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
        User.createUser(newUser, (err,createdUser) => {
            globals.expect(err).toBeNull();
            globals.expect(createdUser.UserID).toEqual("UserID");
            globals.expect(createdUser.Password).toEqual(service.hashElement("Password"));
            globals.expect(createdUser.First_Name).toEqual("First_Name");
            globals.expect(createdUser.Last_Name).toEqual("Last_Name");
            globals.expect(createdUser.Phone_Number).toEqual("Phone_Number");
            globals.expect(createdUser.Gender).toEqual("Gender");
            globals.expect(createdUser.Smoke).toEqual("Smoke");
            globals.expect(createdUser.SurgeryType).toEqual("SurgeryType");
            globals.expect(createdUser.Education).toEqual("Education");
            globals.expect(createdUser.Height).toEqual(120);
            globals.expect(createdUser.Weight).toEqual(55);
            globals.expect(createdUser.BMI_NUMBER).toEqual(100);
            globals.expect(createdUser.BMI).toEqual("100");
            globals.expect(createdUser.BirthDate).toEqual(1620139890041);
            globals.expect(createdUser.Type[0]).toEqual("patient");
            globals.expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            globals.expect(createdUser.Questionnaires.length).toEqual(0);
            globals.expect(createdUser.VerificationQuestion).toEqual(1);
            globals.expect(createdUser.VerificationAnswer).toEqual("2");
            globals.expect(createdUser.ValidTime).toEqual(1620139890041);
            User.updateUser(updatedUser,(err, user) => {
                globals.expect(err).toBeNull();
                globals.expect(user.First_Name).toEqual("First_Name");
                globals.expect(user.Last_Name).toEqual("Last_Name");
                globals.expect(user.Phone_Number).toEqual("Phone_Number");
                globals.expect(user.Gender).toEqual("Gender");
                globals.expect(user.Smoke).toEqual("Smoke");
                globals.expect(user.SurgeryType).toEqual("SurgeryType");
                globals.expect(user.Education).toEqual("Education");
                globals.expect(user.Height).toEqual(180);
                globals.expect(user.Weight).toEqual(66);
                globals.expect(user.BMI_NUMBER).toEqual(100);
                globals.expect(user.BMI).toEqual("100");
                globals.expect(user.BirthDate).toEqual(1620139890041);
                globals.expect(user.Type[0]).toEqual("patient");
                globals.expect(user.DateOfSurgery).toEqual(1620139890041);
                globals.expect(user.Questionnaires.length).toEqual(0);
                globals.expect(user.VerificationQuestion).toEqual(1);
                globals.expect(user.VerificationAnswer).toEqual("2");
                globals.expect(user.ValidTime).toEqual(1620139890041);
                done();
            });
        });
    });


    globals.it('Change Password', (done) => {
        const newUser = new User({
            UserID: "UserID",
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
        User.createUser(newUser, (err,createdUser) => {
            globals.expect(err).toBeNull();
            globals.expect(createdUser.UserID).toEqual("UserID");
            globals.expect(createdUser.Password).toEqual(service.hashElement("Password"));
            globals.expect(createdUser.First_Name).toEqual("First_Name");
            globals.expect(createdUser.Last_Name).toEqual("Last_Name");
            globals.expect(createdUser.Phone_Number).toEqual("Phone_Number");
            globals.expect(createdUser.Gender).toEqual("Gender");
            globals.expect(createdUser.Smoke).toEqual("Smoke");
            globals.expect(createdUser.SurgeryType).toEqual("SurgeryType");
            globals.expect(createdUser.Education).toEqual("Education");
            globals.expect(createdUser.Height).toEqual(120);
            globals.expect(createdUser.Weight).toEqual(55);
            globals.expect(createdUser.BMI_NUMBER).toEqual(100);
            globals.expect(createdUser.BMI).toEqual("100");
            globals.expect(createdUser.BirthDate).toEqual(1620139890041);
            globals.expect(createdUser.Type[0]).toEqual("patient");
            globals.expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            globals.expect(createdUser.Questionnaires.length).toEqual(0);
            globals.expect(createdUser.VerificationQuestion).toEqual(1);
            globals.expect(createdUser.VerificationAnswer).toEqual("2");
            globals.expect(createdUser.ValidTime).toEqual(1620139890041);
            User.getUserByUserID("UserID",(err, user) => {
                globals.expect(err).toBeNull();
                globals.expect(user.UserID).toEqual("UserID");
                globals.expect(user.Password).toEqual(service.hashElement("Password"));
                User.changePassword(user,"PasswordNew", (err,userNewPass) =>{
                    globals.expect(err).toBeNull();
                    globals.expect(user.UserID).toEqual("UserID");
                    globals.expect(user.Password).toEqual(service.hashElement("PasswordNew"))
                    done();
                });
            });
        });
    });

});