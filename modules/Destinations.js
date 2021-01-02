var mongoose = require('mongoose');


//Define a schema
var Schema = mongoose.Schema;

var StepsDestinationSchema = new Schema({
    Target: Number,
    Level: Number,
    ExecutionNum: Number,
    SurgeryType: String
});

var PatientsStepsLevelSchema = new Schema({
    UserID: String,
    Level: Number,
    RepeatsLeft: Number
});


//changes changeLevel saved in db
// module.exports.changeLevel = function(user, newLevel, callback){
//     if(typeof(newLevel) == 'undefined') {
//         error = {'message': 'Error has occured. Please try again.'};
//         callback(error);
//     }
//     else{
//         user.Level = newLevel;
//         user.save(callback);
//     }
// };

module.exports.StepsDestination = mongoose.model('StepsDestination', StepsDestinationSchema, 'StepsDestination');
module.exports.PatientsStepsLevel = mongoose.model('PatientsStepsTarget', PatientsStepsLevelSchema, 'PatientsStepsTarget');

// module.exports.PatientsStepsLevel.changeLevel = function(level, newLevel, callback){
//     if(typeof(newLevel) == 'undefined') {
//         error = {'message': 'Error has occured. Please try again.'};
//         callback(error);
//     }
//     else{
//         level.Level = newLevel;
//         level.save(callback);
//     }
// };

// const StepsDestination = module.exports = mongoose.model('StepsDestination', StepsDestinationSchema, 'StepsDestination');
// const PatientLevel = module.exports = mongoose.model('PatientsStepsTarget', PatientsStepsLevelSchema, 'PatientsStepsTarget');


// module.exports.getTargetByLevel = async function(level, callback){
//     var query = {Level: level};
//     await StepsDestination.findOne(query, callback);
// };
//
// module.exports.createTarget = function(newTarget, callback){
//     newTarget.save(callback);
// };
//
// module.exports.insertPatientLevel = function(newTarget, callback){
//     newTarget.save(callback);
// };

// module.exports.getUserMessages = async function(userid, callback){
//     var query = {To: userid};
//     await Message.find(query, callback);
// };

//create models
//------------------------------------------------



//Define a schema




//create models

//creates message in db


//gets messages from db by username
// module.exports.getUserMessages = async function(userid, callback){
//     var query = {To: userid};
//     await Message.find(query, callback);
// };
