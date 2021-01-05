var express = require('express');
var router = express.Router();
var common = require('../common');
var Instruction = require('../../modules/InstructionsSurgery');
const { v4: uuidv4 } = require('uuid');
var User = require('../../modules/User');


router.get('/:instructionId', async function (req, res) {
    await Instruction.getInstructionsSurgery(req.params.instructionId,function (err, instruction) {
        if(err)
            common(res, true, err, null);
        else
            common(res, false, null, instruction);
    });
});


router.post('/', async function (req, res) {
        const newInstruction = new Instruction({
            InstructionId: req.body.InstructionId,
            Target: req.body.Target,
            TestsResults: req.body.TestsResults,
            TestProcess: req.body.TestProcess

        });
        await Instruction.createInstructionsSurgery(newInstruction, function (err, instruction) {
            if (err)
                common(res, true, err, null);
            else
                common(res, false, null, {
                    instructionId: instruction.InstructionId
                });
        });
    });




module.exports = router;