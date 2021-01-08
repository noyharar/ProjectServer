var express = require('express');
var router = express.Router();
var common = require('../common');
var csv = require('csvtojson');
var service = require('../../service');
var patientLastDaySteps = require('../../modules/Destinations').LastDayPatientSteps;
var StepsMetric = require('../../modules/Metrics').StepsMetric;

// var StepDestination = require('../../modules/Destinations').StepsDestination;
// var PatientsStepsLevel = require('../../modules/Destinations').PatientsStepsLevel;



router.post('/insertLastDaySteps', async function (req, res) {
    let lastDaySteps = new patientLastDaySteps({
        UserID: req.UserID,
        LastDayStepsNumber: req.body.LastDayStepsNumber,
        Timestamp: (new Date).getTime(),
    });
    await lastDaySteps.save(function (error) {
        common(res, error, error, lastDaySteps)
    });
});

router.get('/checkPatientProgress', async function (req,res){
    let lastDaySteps;
    let currentSteps;
    let timeStepsDone;
    let userID;
    const user = await patientLastDaySteps.find({UserID: req.UserID,}).sort({Timestamp: -1}).limit(1).lean().exec();
    lastDaySteps = user[0].LastDayStepsNumber
    console.log(lastDaySteps)
    const lastSteps = await StepsMetric.find({UserID: req.UserID,}).sort({Timestamp: -1}).limit(1).lean().exec();
    currentSteps = lastSteps[0].Data
    userID = lastSteps[0].UserID
    timeStepsDone = lastSteps[0].Timestamp
    if(currentSteps>lastDaySteps){
        let lastDayStepsForHistory = new patientLastDaySteps({
            UserID: userID,
            LastDayStepsNumber: currentSteps,
            Timestamp: (new Date).getTime()
        });
        console.log("well Done! you improved your steps from last day")
        await lastDayStepsForHistory.save(function (error) {
            common(res,error,error,{targetDone: true,  currentSteps: currentSteps, lastDaySteps:lastDaySteps} )
        });
    }
    else{
        let lastDayStepsForHistory = new patientLastDaySteps({
            UserID: userID,
            LastDayStepsNumber: currentSteps,
            Timestamp: (new Date).getTime()
        });
        console.log("You not improved your steps from last day")
        await lastDayStepsForHistory.save(function (error) {
            common(res,error,error,{targetDone: false,  currentSteps: currentSteps, lastDaySteps:lastDaySteps} )
        });
    }
});

//----------------------------------------------old code-------------------------------------

// router.post('/insertTarget', async function (req, res) {
//     let newTarget = new StepDestination({
//         Target: req.body.target,
//         Level: req.body.level,
//         ExecutionNum: req.body.ExecutionNum,
//         SurgeryType: ""
//     });
//     await newTarget.save(function (error) {
//         common(res, error, error, newTarget)
//     });
// });
//
// router.post('/insertPatientTarget', async function (req, res) {
//     let newPatientTarget = new PatientsStepsLevel({
//         UserID: req.UserID,
//         Level: req.body.level,
//         RepeatsLeft: req.body.RepeatsLeft,
//     });
//     await newPatientTarget.save(function (error) {
//         common(res, error, error, newPatientTarget)
//     });
// });
//
//
// //getPatientLevel
// router.get('/getPatientProgress', async function (req, res) {
//     let currentLevel;
//     let currentRepeats;
//     let TargetDest;
//     let currentSteps;
//     let targetRepeats;
//     let timeStepsDone;
//     let userIdFound;
//
//     const user = await PatientsStepsLevel.findOne({UserID: req.UserID}).lean().exec();
//     currentLevel = user.Level
//     userIdFound = user.UserID
//     currentRepeats = user.RepeatsLeft
//     const target = await StepDestination.findOne({Level: currentLevel}).lean().exec();
//     TargetDest = target.Target
//     targetRepeats = target.ExecutionNum
//
//     const lastSteps = await StepsMetric.find({UserID: req.UserID,}).sort({Timestamp: -1}).limit(1).lean().exec();
//     currentSteps = lastSteps[0].Data
//     timeStepsDone = lastSteps[0].Timestamp
//
//     let today = new Date();
//     let lastDate = new Date(timeStepsDone)
//     if(today.getFullYear() === lastDate.getFullYear() &&
//         today.getMonth() === lastDate.getMonth() &&
//         today.getDate() === lastDate.getDate()){
//
//         if(currentSteps>=TargetDest){
//             if(targetRepeats - currentRepeats === targetRepeats - 1){
//                 let newLevel = currentLevel + 1
//                 const newTarget = await StepDestination.findOne({Level: newLevel}).lean().exec();
//                 let newCurrentRepeats = newTarget.ExecutionNum
//                 let newLevelTarget = newTarget.Target
//
//                 const update = await PatientsStepsLevel.update({_userID:userIdFound,Level:newLevel,RepeatsLeft:newCurrentRepeats})//the new level
//
//                 //return: target done: true, innNewLevel: true, current level: num, repeat left to next level: num
//                 console.log("Well Done you got your target and level up!")
//                 common(res, null, null, {
//                     targetDone: true,  inNewLevel: true, currentLevel:newLevel,repeatsLeft:newCurrentRepeats,stepsTarget:newLevelTarget
//                 });
//             }
//             else{
//                 let newCurrentRepeats = currentRepeats -1
//                 const update = await PatientsStepsLevel.update({_userID:userIdFound,RepeatsLeft:newCurrentRepeats})
//                 console.log("Well Done you got your target!")
//                 common(res, null, null, {
//                     targetDone: true,  inNewLevel: false, currentLevel:currentLevel,repeatsLeft: newCurrentRepeats,stepsTarget:TargetDest
//                 });
//             }// console.log("Well Done you got your target!")
//         }
//         else{
//             console.log("you dont get your target")
//             common(res, null, null, {
//                 targetDone: false,  inNewLevel: false, currentLevel:currentLevel,repeatsLeft: currentRepeats,stepsTarget:TargetDest
//             });
//         }
//
//     }
//     else{
//         common(res, null, null, {
//             targetDone: false,  inNewLevel: false, currentLevel:currentLevel,repeatsLeft: currentRepeats,stepsTarget:TargetDest
//         });
//     }
// });

//----------------------------------------------old code-------------------------------------



module.exports = router;