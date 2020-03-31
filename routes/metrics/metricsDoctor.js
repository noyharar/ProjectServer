var express = require('express');
var router = express.Router();
var common = require('../common');
var StepsMetric = require('../../modules/Metrics').StepsMetric;
var DistanceMetric = require('../../modules/Metrics').DistanceMetric;
var CaloriesMetric = require('../../modules/Metrics').CaloriesMetric;
var SleepMetric = require('../../modules/Metrics').SleepMetric;
var AccelerometerMetric = require('../../modules/Metrics').AccelerometerMetric;
var WeatherMetric = require('../../modules/Metrics').WeatherMetric;
var ActivityMetric = require('../../modules/Metrics').ActivityMetric;


router.get('/getSteps', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    StepsMetric.find({
            UserID: req.query.UserID,
            Timestamp: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.get('/getDistance', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    DistanceMetric.find({
            UserID: req.query.UserID,
            Timestamp: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.get('/getCalories', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    CaloriesMetric.find({
            UserID: req.query.UserID,
            Timestamp: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.get('/getSleep', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    SleepMetric.find({
            UserID: req.query.UserID,
            Timestamp: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.get('/getAccelerometer', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    AccelerometerMetric.find({
            UserID: req.query.UserID,
            Timestamp: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.get('/getWeather', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    WeatherMetric.find({
            UserID: req.query.UserID,
            Timestamp: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.get('/getActivity', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    ActivityMetric.find({
            UserID: req.query.UserID,
            Timestamp: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});


module.exports = router;