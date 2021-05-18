var mongoose = require('mongoose');


//Define a schema
var Schema = mongoose.Schema;

var VerificationSchema = new Schema({
    QuestionID: {type:Number,
        unique:true
    },
    QuestionText: String
});

//create models
var Verification = module.exports = mongoose.model('Verification', VerificationSchema, 'Verification');

module.exports.createVerification= function(newVerification, callback){
    //console.log(newUser);
    newVerification.save(callback);
};


module.exports.getOneVerification = function(qid, callback){
    var query = {QuestionID: qid};
    Verification.findOne(query, callback);
};

module.exports.getAllVerification = function(callback){
    Verification.find({}, callback);
};
