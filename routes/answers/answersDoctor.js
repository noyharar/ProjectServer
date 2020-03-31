var express = require('express');
var router = express.Router();
var common = require('../common');
var DailyAnswer = require('../../modules/Answer').DailyAnswer;
var PeriodicAnswer = require('../../modules/Answer').PeriodicAnswer;


var getDate = function (timestamp) {
    date = new Date(timestamp).toISOString();
    date_string = date.slice(0, 10) + ' ' + date.slice(-13, -8)
    return date_string;
};


router.get('/getDailyAnswers/:userID', function (req, res, next) {
    if (typeof (req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    DailyAnswer.find({
            UserID: req.params.userID,
            QuestionnaireID: 0,
            ValidDate: {$gte: req.query.start_time, $lte: req.query.end_time}
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.get('/getPeriodicAnswers/:UserID/:QuestionnaireID', function (req, res, next) {
    if (typeof (req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    var ansArr=[];
    PeriodicAnswer.find({
            UserID: req.params.UserID,
            QuestionnaireID: req.params.QuestionnaireID,
            ValidDate: {$gte: req.query.start_time, $lte: req.query.end_time}
        }
        , (function (err, docs) {
            docs.forEach(function(answer){
                ansArr.push({
                    "Score": answer.Score,
                    "ValidDate": answer.ValidDate
                })
            });
            common(res, err, err, ansArr);
        }));
});


module.exports = router;