var express = require('express');
var router = express.Router();
var common = require('../common');
var Instruction = require('../../modules/InstructionsSurgery');
const { v4: uuidv4 } = require('uuid');
var User = require('../../modules/User');
const { getGridFSFiles, createGridFSReadStream } = require("../../instructionsUpload/my-gridfs-service");
const GridFSMiddleware = require("../../instructionsUpload/gridfs-middleware");
const asyncWrapper = require("../../instructionsUpload/async-wrapper");

router.post('/', async function (req, res) {
        const newInstruction = new Instruction({
            InstructionId: req.body.InstructionId,
            Title: req.body.Title,
            PdfName: req.body.PdfName,
            ImagePart: req.body.ImagePart,
            Category: req.body.Category,
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


/** @route  POST /pdf
 *  @desc   Upload PDF
 */
router.post(
    "/pdf",
    [GridFSMiddleware()],
    asyncWrapper(async (req, res) => {
        let category = req.body.category;
        console.log(category);
        const { originalname, mimetype, id, size } = req.file;
        res.send({ originalname, mimetype, id, size });
    })
);
module.exports = router;