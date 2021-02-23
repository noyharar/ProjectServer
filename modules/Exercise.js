var mongoose = require('mongoose');
var service = require('../service.js');
var jwt = require('jsonwebtoken');
var common = require('../routes/common');

//Define a schema
var Schema = mongoose.Schema;

var ExerciseSchema = new Schema({
    ExerciseId : {
        type:String,
        unique:true,
    },
    Category : {
        type:String,
    },
    Video : {
        type:String,
    },
});

//create models
const Exercise = module.exports = mongoose.model('Exercise', ExerciseSchema,'Exercise');

module.exports.createExercise= function(newExercise, callback){
    //console.log(newUser);
    newExercise.save(callback);
};

//gets messages from db by category
module.exports.getExercises = async function(callback){
    // var query = {Category: category};
    await Exercise.find({},callback);
};

// module.exports.postNewVideo = async function(category,newVideo, callback){
//     var query = {Category: category};
//     let exercises = await Exercise.findOne(query, callback);
//     exercises.Videos.push(newVideo);
//     exercises.save(callback);
// };





