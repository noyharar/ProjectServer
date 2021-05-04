const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const Message = require('../modules/Message');
const globals = require("@jest/globals");

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
globals.describe('Exercise tests ', () => {

    globals.it('Create exercise', (done) => {
        const messageToCreate = new Message({
            MessageId: "MessageId",
            From: "From",
            To: "To",
            Content: "Content",
            Date: 1620139890041,
            FromFirstName: "FromFirstName",
            FromLastName: "FromLastName"
        });
        const callback = (err, createdMessage) => {
            globals.expect(err).toBeNull();
            globals.expect(createdMessage.MessageId).toEqual("MessageId");
            globals.expect(createdMessage.From).toEqual("From");
            globals.expect(createdMessage.To).toEqual("To");
            globals.expect(createdMessage.Content).toEqual("Content");
            globals.expect(createdMessage.Date).toEqual(1620139890041);
            globals.expect(createdMessage.FromFirstName).toEqual("FromFirstName");
            globals.expect(createdMessage.FromLastName).toEqual("FromLastName");
            done();
        };
        Message.createMessage(messageToCreate, callback);
    });
    globals.it('Get messages - exists user', (done) => {
        const messageToCreate = new Message({
            MessageId: "MessageId",
            From: "From",
            To: "To",
            Content: "Content",
            Date: 1620139890041,
            FromFirstName: "FromFirstName",
            FromLastName: "FromLastName"
        });

        Message.createMessage(messageToCreate, (err, createdMessage) => {
            globals.expect(err).toBeNull();
            globals.expect(createdMessage.MessageId).toEqual("MessageId");
            globals.expect(createdMessage.From).toEqual("From");
            globals.expect(createdMessage.To).toEqual("To");
            globals.expect(createdMessage.Content).toEqual("Content");
            globals.expect(createdMessage.Date).toEqual(1620139890041);
            globals.expect(createdMessage.FromFirstName).toEqual("FromFirstName");
            globals.expect(createdMessage.FromLastName).toEqual("FromLastName");
            Message.getUserMessages("To",(err, instructions) => {
                globals.expect(err).toBeNull();
                globals.expect(instructions.length).toEqual(1);
                done();
            });
        });
    });

    globals.it('Get messages - not exists user', (done) => {
        const messageToCreate = new Message({
            MessageId: "MessageId",
            From: "From",
            To: "To",
            Content: "Content",
            Date: 1620139890041,
            FromFirstName: "FromFirstName",
            FromLastName: "FromLastName"
        });

        Message.createMessage(messageToCreate, (err, createdMessage) => {
            globals.expect(err).toBeNull();
            globals.expect(createdMessage.MessageId).toEqual("MessageId");
            globals.expect(createdMessage.From).toEqual("From");
            globals.expect(createdMessage.To).toEqual("To");
            globals.expect(createdMessage.Content).toEqual("Content");
            globals.expect(createdMessage.Date).toEqual(1620139890041);
            globals.expect(createdMessage.FromFirstName).toEqual("FromFirstName");
            globals.expect(createdMessage.FromLastName).toEqual("FromLastName");
            Message.getUserMessages("NotExist",(err, instructions) => {
                globals.expect(err).toBeNull();
                globals.expect(instructions.length).toEqual(0);
                done();
            });
        });
    });

    globals.it('Get exercises - not exists user', (done) => {
        Message.getUserMessages("notExist", (err, exercises) => {
            globals.expect(err).toBeNull();
            globals.expect(exercises.length).toEqual(0);
            done();
        });
    });
    globals.it('Delete exist message', (done) => {
        const messageToCreate = new Message({
            MessageId: "MessageId",
            From: "From",
            To: "To",
            Content: "Content",
            Date: 1620139890041,
            FromFirstName: "FromFirstName",
            FromLastName: "FromLastName"
        });
        Message.createMessage(messageToCreate, (err, createdMessage) => {
            globals.expect(err).toBeNull();
            globals.expect(createdMessage.MessageId).toEqual("MessageId");
            globals.expect(createdMessage.From).toEqual("From");
            globals.expect(createdMessage.To).toEqual("To");
            globals.expect(createdMessage.Content).toEqual("Content");
            globals.expect(createdMessage.Date).toEqual(1620139890041);
            globals.expect(createdMessage.FromFirstName).toEqual("FromFirstName");
            globals.expect(createdMessage.FromLastName).toEqual("FromLastName");
            Message.getUserMessages("To",(err, instrucions) => {
                globals.expect(err).toBeNull();
                globals.expect(instrucions.length).toEqual(1);
                Message.removeMessage(messageToCreate.MessageId,(err, exercises) => {
                    globals.expect(err).toBeNull();
                    globals.expect(exercises.deletedCount).toEqual(1);
                    done();
                });
            });

        });
    });
    globals.it('Delete not exist message', (done) => {
        const messageToCreate = new Message({
            MessageId: "MessageId",
            From: "From",
            To: "To",
            Content: "Content",
            Date: 1620139890041,
            FromFirstName: "FromFirstName",
            FromLastName: "FromLastName"
        });
        Message.createMessage(messageToCreate, (err, createdMessage) => {
            globals.expect(err).toBeNull();
            globals.expect(createdMessage.MessageId).toEqual("MessageId");
            globals.expect(createdMessage.From).toEqual("From");
            globals.expect(createdMessage.To).toEqual("To");
            globals.expect(createdMessage.Content).toEqual("Content");
            globals.expect(createdMessage.Date).toEqual(1620139890041);
            globals.expect(createdMessage.FromFirstName).toEqual("FromFirstName");
            globals.expect(createdMessage.FromLastName).toEqual("FromLastName");
            Message.getUserMessages("To",(err, instrucions) => {
                globals.expect(err).toBeNull();
                globals.expect(instrucions.length).toEqual(1);
                Message.removeMessage("notExists",(err, exercises) => {
                    globals.expect(err).toBeNull();
                    globals.expect(exercises.deletedCount).toEqual(0);
                    done();
                });
            });

        });
    });
});