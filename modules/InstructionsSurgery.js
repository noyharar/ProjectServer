var mongoose = require('mongoose');
var service = require('../service.js');
var jwt = require('jsonwebtoken');
var common = require('../routes/common');

//Define a schema
var Schema = mongoose.Schema;

var InstructionsSurgerySchema = new Schema({
    InstructionId : {
        type:String,
        unique:true,
    },
    Target : {
        type:String,
    },
    TestsResults : {
        type:Array,
    },
    TestProcess: {
        type:Array,
    }
});

//create models
const InstructionsSurgery = module.exports = mongoose.model('InstructionsSurgery', InstructionsSurgerySchema,'InstructionsSurgery');

module.exports.createInstructionsSurgery = function(newInstruction, callback){
    //console.log(newUser);
    newInstruction.save(callback);
};

//gets messages from db by username
module.exports.getInstructionsSurgery = async function(instructionId, callback){
    var query = {InstructionId: instructionId};
    await InstructionsSurgery.findOne(query, callback);
};






