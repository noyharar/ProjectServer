
let express = require('express');
let StepsMetric = require('./Metrics').StepsMetric;
let DistanceMetric = require('./Metrics').DistanceMetric;
let CaloriesMetric = require('./Metrics').CaloriesMetric;
let SleepMetric = require('./Metrics').SleepMetric;
let AccelerometerMetric = require('./Metrics').AccelerometerMetric;
let WeatherMetric = require('./Metrics').WeatherMetric;
let ActivityMetric = require('./Metrics').ActivityMetric;
let User = require('./User');
let Group = require('./Group');


async function calculateGroupsData() {
  //  var realNow = new Date().setHours(-48,0,0,0);
 //   var start = new Date().setHours(-24,0,0,0);
    var realNow =1585413706123;
    var start = 1585413706160;
    let groups= await Group.getAllGroups();
    for (let i=0; i<groups.length;i++){
        let users=await findAllUsersIdsInGroup(groups[i]);
        let ids=[];
        for (let j=0;j<users.length;j++){
            ids.push(users[j].UserID);
        }
            //distance
            let docsDistance = await DistanceMetric.find({
                UserID: {$in: ids},
                ValidTime: {$gte: realNow, $lte:start}
            }).lean().exec();

            let averageDistance=findAverage(docsDistance);
            let newMetricDistance = new DistanceMetric({
            UserID: groups[i].groupId,
            Timestamp: realNow,
            ValidTime: start,
            Data: averageDistance
        });

        await newMetricDistance.save(function (err, metric) {
            if (err) return console.error(err);
            console.log(metric.UserID+" group saved in collection.");
        });

        //steps
        let docsSteps = await StepsMetric.find({
            UserID: {$in: ids},
            ValidTime: {$gte: realNow, $lte:start}
        }).lean().exec();

        let averageSteps=findAverage(docsSteps);
        let newMetricSteps = new StepsMetric({
            UserID: groups[i].groupId,
            Timestamp: realNow,
            ValidTime: start,
            Data: averageSteps
        });

        await newMetricSteps.save(function (err, metric) {
            if (err) return console.error(err);
            console.log(metric.UserID+" group saved in collection.");
        });

        //Calories
        let docsCalories = await CaloriesMetric.find({
            UserID: {$in: ids},
            ValidTime: {$gte: realNow, $lte:start}
        }).lean().exec();

        let averageCalories=findAverage(docsCalories);
        let newMetricCalories = new CaloriesMetric({
            UserID: groups[i].groupId,
            Timestamp: realNow,
            ValidTime: start,
            Data: averageCalories
        });

        await newMetricCalories.save(function (err, metric) {
            if (err) return console.error(err);
            console.log(metric.UserID+" group saved in collection.");
        });
        //
        // //sleep
        // let docsSleep = await SleepMetric.find({
        //     UserID: {$in: ids},
        //     ValidTime: {$gte: realNow, $lte:start}
        // }).lean().exec();
        //
        // let averageSleep=findAverage(docsSleep);
        // let newMetricSleep = new SleepMetric({
        //     UserID: groups[i].groupId,
        //     Timestamp: realNow,
        //     ValidTime: start,
        //     Data: averageSleep
        // });
        //
        // await newMetricSleep.save(function (err, metric) {
        //     if (err) return console.error(err);
        //     console.log(metric.UserID+" group saved in collection.");
        // });
        //
        // //Accelerometer
        // let docsAccelerometer = await AccelerometerMetric.find({
        //     UserID: {$in: ids},
        //     ValidTime: {$gte: realNow, $lte:start}
        // }).lean().exec();
        //
        // let averageAccelerometer=findAverage(docsAccelerometer);
        // let newMetricAccelerometer = new AccelerometerMetric({
        //     UserID: groups[i].groupId,
        //     Timestamp: realNow,
        //     ValidTime: start,
        //     Data: averageAccelerometer
        // });
        //
        // await newMetricAccelerometer.save(function (err, metric) {
        //     if (err) return console.error(err);
        //     console.log(metric.UserID+" group saved in collection.");
        // });
        //
        // //Weather
        // let docsWeather = await WeatherMetric.find({
        //     UserID: {$in: ids},
        //     ValidTime: {$gte: realNow, $lte:start}
        // }).lean().exec();
        //
        // let averageWeather=findAverage(docsWeather);
        // let newMetricWeather= new WeatherMetric({
        //     UserID: groups[i].groupId,
        //     Timestamp: realNow,
        //     ValidTime: start,
        //     Data: averageWeather
        // });
        //
        // await newMetricWeather.save(function (err, metric) {
        //     if (err) return console.error(err);
        //     console.log(metric.UserID+" group saved in collection.");
        // });
        //
        // //activity
        // let docsActivity = await ActivityMetric.find({
        //     UserID: {$in: ids},
        //     ValidTime: {$gte: realNow, $lte:start}
        // }).lean().exec();
        //
        // let averageActivity=findAverage(docsActivity);
        // let newMetricActivity = new ActivityMetric({
        //     UserID: groups[i].groupId,
        //     Timestamp: realNow,
        //     ValidTime: start,
        //     Data: averageActivity
        // });
        //
        // await newMetricActivity.save(function (err, metric) {
        //     if (err) return console.error(err);
        //     console.log(metric.UserID+" group saved in collection.");
        // });

        }
    }

async function findAllUsersIdsInGroup(group){
    let filterName=group.filter.filterName;
    let filterValue=group.filter.filterValue;
    let query={};
    query[filterName]=filterValue;
    return await User.find(query).lean().exec();

}

function findAverage(docs){
    if (docs.length==0) return 0;
    let sum=0;
    for (let i=0;i<docs.length;i++)
        sum=sum+docs[i].Data;

    return sum/docs.length;

}

module.exports=calculateGroupsData;