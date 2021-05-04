const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const Instruction = require('../modules/InstructionsSurgery');
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
globals.describe('InstructionsSurgery tests ', () => {
    globals.it('Create InstructionsSurgery', (done) => {
        const newInstruction = new Instruction({
            InstructionId: "InstructionId",
            Title: "Title",
            PdfName: "PdfName",
            Category: "Category"
        });
        const callback = (err, createdInstruction) => {
            globals.expect(err).toBeNull();
            globals.expect(createdInstruction.InstructionId).toEqual("InstructionId");
            globals.expect(createdInstruction.Title).toEqual("Title");
            globals.expect(createdInstruction.PdfName).toEqual("PdfName");
            globals.expect(createdInstruction.Category).toEqual("Category");
            done();
        };
        Instruction.createInstructionsSurgery(newInstruction, callback);
    });

    globals.it('Get Instructions', (done) => {
        const newInstruction = new Instruction({
            InstructionId: "InstructionId",
            Title: "Title",
            PdfName: "PdfName",
            Category: "Category"
        });

        Instruction.createInstructionsSurgery(newInstruction, (err, creatednewInstruction) => {
            globals.expect(err).toBeNull();
            globals.expect(creatednewInstruction.InstructionId).toEqual("InstructionId");
            globals.expect(creatednewInstruction.Title).toEqual("Title");
            globals.expect(creatednewInstruction.PdfName).toEqual("PdfName");
            globals.expect(creatednewInstruction.Category).toEqual("Category");
            Instruction.getInstructionsSurgery({},(err, instructions) => {
                globals.expect(err).toBeNull();
                globals.expect(instructions.length).toEqual(1);
                globals.expect(instructions[0].InstructionId).toEqual("InstructionId");
                globals.expect(instructions[0].Title).toEqual("Title");
                globals.expect(instructions[0].PdfName).toEqual("PdfName");
                globals.expect(instructions[0].Category).toEqual("Category");
                done();
            });
        });
    });




    globals.it('Get Instructions - empty', (done) => {
        Instruction.getInstructionsSurgery({},(err, instructions) => {
            globals.expect(err).toBeNull();
            globals.expect(instructions.length).toEqual(0);
            done();
        });
    });
    globals.it('Delete exist exercise', (done) => {
        const newInstruction = new Instruction({
            InstructionId: "InstructionId",
            Title: "Title",
            PdfName: "PdfName",
            Category: "Category"
        });

        Instruction.createInstructionsSurgery(newInstruction, (err, creatednewInstruction) => {
            globals.expect(err).toBeNull();
            globals.expect(creatednewInstruction.InstructionId).toEqual("InstructionId");
            globals.expect(creatednewInstruction.Title).toEqual("Title");
            globals.expect(creatednewInstruction.PdfName).toEqual("PdfName");
            globals.expect(creatednewInstruction.Category).toEqual("Category");
            Instruction.getInstructionsSurgery({},(err, instructions) => {
                globals.expect(err).toBeNull();
                globals.expect(instructions.length).toEqual(1);
                globals.expect(instructions[0].InstructionId).toEqual("InstructionId");
                globals.expect(instructions[0].Title).toEqual("Title");
                globals.expect(instructions[0].PdfName).toEqual("PdfName");
                globals.expect(instructions[0].Category).toEqual("Category");
                Instruction.deleteInstruction(newInstruction.InstructionId,(err, instructions) => {
                    globals.expect(err).toBeNull();
                    globals.expect(instructions.deletedCount).toEqual(1);
                    done();
                });
            });
        });
    });
    globals.it('Delete not exist instruction', (done) => {
        Instruction.deleteInstruction("NoId",(err, exercises) => {
            globals.expect(err).toBeNull();
            globals.expect(exercises.deletedCount).toEqual(0);
            done();
        });
    });
});