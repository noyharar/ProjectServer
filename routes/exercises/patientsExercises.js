var express = require('express');
var router = express.Router();
var common = require('../common');
var Message = require('../../modules/Message');
const { v4: uuidv4 } = require('uuid');
var Exercise = require('../../modules/Exercise');


router.get('/', async function (req, res) {
    await Exercise.getExercises(function (err, exercise) {
        if(err)
            common(res, true, err, null);
        else
            common(res, false, null, exercise);
    });
});



module.exports = router;