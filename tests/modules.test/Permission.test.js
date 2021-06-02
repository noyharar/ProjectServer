const mongoose = require('mongoose');
const dbHandler = require('../db-handler');
const Permission = require('../../modules/Permission');
const {beforeAll, it, afterAll, afterEach, expect, describe} = require("@jest/globals");

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

/**
 * Permission test suite.
 */
describe('Permission tests ', () => {

    it('Create Permission', (done) => {
        const PermissionToCreate = new Permission({
            DoctorID: "doctorId",
            PatientID: "patientId"
        });
        const callback = (err, createdPermission) => {
            expect(err).toBeNull();
            expect(createdPermission.DoctorID).toEqual("doctorId");
            expect(createdPermission.PatientID).toEqual("patientId");
            done();
        };
        Permission.createPermission(PermissionToCreate, callback);
    });


    it('Get one Permission', (done) => {
        const PermissionToCreate = new Permission({
            DoctorID: "doctorId",
            PatientID: "patientId"
        });
        Permission.createPermission(PermissionToCreate, (err, createdPermission) => {
            expect(err).toBeNull();
            expect(createdPermission.DoctorID).toEqual("doctorId");
            expect(createdPermission.PatientID).toEqual("patientId");
            Permission.getOnePermission("doctorId","patientId",(err, Permission) => {
                expect(err).toBeNull();
                expect(Permission.DoctorID).toEqual("doctorId");
                expect(Permission.PatientID).toEqual("patientId");
                done();
            });
        });
    });

    it('Get all Permissions', (done) => {
        const PermissionToCreate = new Permission({
            DoctorID: "doctorId",
            PatientID: "patientId"
        });
        const PermissionToCreateSecond = new Permission({
            DoctorID: "doctorId2",
            PatientID: "patientId2"
        });

        Permission.createPermission(PermissionToCreate, (err, createdPermission) => {
            expect(err).toBeNull();
            expect(createdPermission.DoctorID).toEqual("doctorId");
            expect(createdPermission.PatientID).toEqual("patientId");
            Permission.createPermission(PermissionToCreateSecond, (err, createdPermissionSecond) => {
                expect(err).toBeNull();
                expect(createdPermissionSecond.DoctorID).toEqual("doctorId2");
                expect(createdPermissionSecond.PatientID).toEqual("patientId2");
                Permission.getAllDoctorPermission("doctorId", (err, Permissions) => {
                    console.log(Permissions)
                    expect(err).toBeNull();
                    expect(Permissions[0].DoctorID).toEqual("doctorId");
                    // expect(Permissions[1].DoctorID).toEqual("doctorId2");
                    done();
                });
            });
        });
    });
});
