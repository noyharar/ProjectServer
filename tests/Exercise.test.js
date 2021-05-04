const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const Exercise = require('../modules/Exercise');
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
        const exerciseToCreate = new Exercise({
            ExerciseId: "ExerciseId",
            Category: "Category",
            Video : "Video"
        });
        const callback = (err, createdExercise) => {
            globals.expect(err).toBeNull();
            globals.expect(createdExercise.ExerciseId).toEqual("ExerciseId");
            globals.expect(createdExercise.Category).toEqual("Category");
            globals.expect(createdExercise.Video).toEqual("Video");
            done();
        };
        Exercise.createExercise(exerciseToCreate, callback);
    });
    globals.it('Get exercises', (done) => {
        const exerciseToCreate = new Exercise({
            ExerciseId: "ExerciseId",
            Category: "Category",
            Video : "Video"
        });

        Exercise.createExercise(exerciseToCreate, (err, createdExercise) => {
            globals.expect(err).toBeNull();
            globals.expect(createdExercise.ExerciseId).toEqual("ExerciseId");
            globals.expect(createdExercise.Category).toEqual("Category");
            globals.expect(createdExercise.Video).toEqual("Video");

            Exercise.getExercises((err, exercises) => {
                globals.expect(err).toBeNull();
                globals.expect(exercises.length).toEqual(1);
                globals.expect(exercises[0].ExerciseId).toEqual("ExerciseId");
                globals.expect(exercises[0].Category).toEqual("Category");
                globals.expect(exercises[0].Video).toEqual("Video");
                done();
            });
        });
    });

    globals.it('Get exercises - empty', (done) => {
        Exercise.getExercises((err, exercises) => {
            globals.expect(err).toBeNull();
            globals.expect(exercises.length).toEqual(0);
            done();
        });
    });
    globals.it('Delete exist exercise', (done) => {
        const exerciseToCreate = new Exercise({
            ExerciseId: "ExerciseId",
            Category: "Category",
            Video : "Video"
        });
        Exercise.createExercise(exerciseToCreate, (err, createdExercise) => {
            globals.expect(err).toBeNull();
            globals.expect(createdExercise.ExerciseId).toEqual("ExerciseId");
            globals.expect(createdExercise.Category).toEqual("Category");
            globals.expect(createdExercise.Video).toEqual("Video");
            Exercise.getExercises((err, exercises) => {
                globals.expect(err).toBeNull();
                globals.expect(exercises.length).toEqual(1);
                globals.expect(exercises[0].ExerciseId).toEqual("ExerciseId");
                globals.expect(exercises[0].Category).toEqual("Category");
                globals.expect(exercises[0].Video).toEqual("Video");
                Exercise.removeExercise(exerciseToCreate.ExerciseId,(err, exercises) => {
                    globals.expect(err).toBeNull();
                    globals.expect(exercises.deletedCount).toEqual(1);
                    done();
                });
            });

        });
    });
    globals.it('Delete not exist exercise', (done) => {
        Exercise.removeExercise("NoId",(err, exercises) => {
            globals.expect(err).toBeNull();
            globals.expect(exercises.deletedCount).toEqual(0);
            done();
        });
    });
});