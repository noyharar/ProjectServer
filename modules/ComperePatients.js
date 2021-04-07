
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

//http://localhost:8180/auth/doctors/comperePatients/getDistanceCompere?start_time=150000000000&end_time=1685413707000&filter="BMI"&groupId=BMI 18.5-25
module.exports.calculateGroupsData=async function () {
   var realNow = new Date().setHours(-48,0,0,0);
    var start = new Date().setHours(-24,0,0,0);
  //  var realNow =1585413706123;
   // var start = 1585413706160;
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


        }
    }

async function findAllUsersIdsInGroup(group){
    let isBeforeSurgery;
    if (group.groupId.endsWith("Before")) isBeforeSurgery=true;
    else isBeforeSurgery=false;

    let filterName=group.filter.filterName;
    let filterValue=group.filter.filterValue;
    if (filterName=="BMI"){

             let min=filterValue.substr(0,filterValue.indexOf('-'));
             if (min =="") // bmi 40+
             {
                 min=40;
                 if (isBeforeSurgery)
                     return await User.find( {BMI_NUMBER: {$gte: parseFloat(min)},"DateOfSurgery":{$gte:new Date().getTime()}});
                 else
                     return await User.find( {BMI_NUMBER: {$gte: parseFloat(min)},"DateOfSurgery":{$lt:new Date().getTime()}});
             }
             let max=filterValue.substring(filterValue.indexOf('-')+1);


        if (isBeforeSurgery)
        return await User.find( {BMI_NUMBER: {$gte: parseFloat(min), $lte:parseFloat(max)},"DateOfSurgery":{$gte:new Date().getTime()}});
        else
            return await User.find( {BMI_NUMBER: {$gte: parseFloat(min), $lte:parseFloat(max)},"DateOfSurgery":{$lt:new Date().getTime()}});
    }
    if (isBeforeSurgery)
    return await User.find({"DateOfSurgery":{$gte:new Date().getTime()},[filterName]:[filterValue]}).lean().exec();
    else
        return await User.find({"DateOfSurgery":{$lt:new Date().getTime()},[filterName]:[filterValue]}).lean().exec();
}

function findAverage(docs){
    if (docs.length==0) return 0;
    let sum=0;
    for (let i=0;i<docs.length;i++)
        sum=sum+docs[i].Data;

    return sum/docs.length;

}

