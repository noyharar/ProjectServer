let express = require('express');
let router = express.Router();
var common = require('../routes/common');
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

        ///.... all metrics
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
    let sum=0;
    for (let i=0;i<docs.length;i++)
        sum=sum+docs[i].Data;

    return sum/docs.length;

}

module.exports=calculateGroupsData();