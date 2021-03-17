var express = require('express');
var router = express.Router();
var User = require('../modules/User');
var common = require('./common');
var jwt = require('jsonwebtoken');
var tempToken = "password";

router.get('/getFirsts', async function(req, res) {
  var allUsers = await User.find({Type: ["patient"]}).lean().exec();
  var ans = [];
  for await(const user of allUsers){
    ans.push(user.First_Name);
  }
  common(res, null, null, ans);
});

router.get('/getLasts', async function(req, res) {
  var allUsers = await User.find({Type: ["patient"]}).lean().exec();
  var ans = [];
  for await(const user of allUsers){
    ans.push(user.Last_Name);
  }
  common(res, null, null, ans);
});

router.get('/getNames', async function(req, res) {
  var allUsers = await User.find({Type: ["patient"]}).lean().exec();
  var ans = [];
  for await(const user of allUsers){
    ans.push({first: user.First_Name, last: user.Last_Name});
  }
  common(res, null, null, ans);
});


router.get('/getUserQuestionnaire', async function(req, res) {
  var userid = "";
  if(req.Type.includes("patient"))
    userid = req.UserID;
  else
    userid = req.query.UserID;
  await User.getUserByUserID(userid, function (err, user) {
    if(err)
      common(res, true, err, null);
    else{
      if(user)
        common(res, false, null, user.Questionnaires);
      else
        common(res, false, "Not Found", null);
    }
  });
});

router.post('/changeUserQuestionnaire', async function(req, res) {
  let daily = {QuestionnaireID: 0, QuestionnaireText: "יומי"};
  let questionnairesArr = [daily];
  let Questionnaires = req.body.Questionnaires;
  if(Questionnaires.length>0){
    for await (const q of Questionnaires){
      if(q.QuestionnaireID==5){
        let eq6 = {QuestionnaireID: 6, QuestionnaireText: "דירוג איכות חיים"};
        questionnairesArr.push(eq6);
      }
      questionnairesArr.push(q);
    }
  }
  var userid = "";
  if(req.Type.includes("patient")){
    userid = req.UserID;
    let eq5 = {QuestionnaireID: 5, QuestionnaireText: "איכות חיים"};
    let eq6 = {QuestionnaireID: 6, QuestionnaireText: "דירוג איכות חיים"};
    questionnairesArr.push(eq5);
    questionnairesArr.push(eq6);
  }
  else
    userid = req.body.UserID;
  await User.updateOne({UserID: userid}, {Questionnaires: questionnairesArr}, function (err, user) {
    if(err)
      common(res, err, err.message, null);
    else {
      if(user)
        common(res, false, null, user.Questionnaires);
      else
        common(res, false, "Not Found", null);
    }
  });
});

router.get('/getDateOfSurgery', async function(req, res) {
  var userid = "";
  if(req.Type.includes("patient"))
    userid = req.UserID;
  else
    userid = req.query.UserID;
  await User.getUserByUserID(userid, function (err, user) {
    if(err)
      common(res, err, err.message, null);
    else {
      if(user)
        common(res, false, null, user.DateOfSurgery);
      else
        common(res, false, "Not Found", null);
    }
  });
});

router.post('/changeDateOfSurgery', async function(req, res) {
  var userid = "";
  if(req.Type.includes("patient"))
    userid = req.UserID;
  else
    userid = req.body.UserID;
  await User.updateOne({UserID: userid}, {DateOfSurgery: req.body.DateOfSurgery}, function (err, user) {
    if(err)
      common(res, err, err.message, null);
    else {
      if(user)
        common(res, false, null, user.DateOfSurgery);
      else
        common(res, false, "Not Found", null);
    }
  });
});


router.post('/askChangePassword', async function (req, res) {
  await User.getUserByUserID(req.UserID, function (err, user) {
    if (user) {
      var payload = {
        UserID: user.UserID, Type: user.Type
      };
      var options = {expiresIn: "300000ms"};
      var token = jwt.sign(payload, tempToken, options);
      common(res, err, err, token);
    }
    else {
      var error = {'message': 'User not exists'};
      common(res, error, error, null);
    }
  });
});

router.get('/userInfo', async function(req, res) {
  var userid = "";
    userid = req.UserID;
  let userObj = await User.findOne({UserID: req.UserID}).lean().exec();

  await User.getUserByUserID(userid, function (err, user) {
    if(err)
      common(res, true, err, null);
    else{
      if(user)
        common(res, false, null, user);
      else
        common(res, false, "Not Found", null);
    }
  });
});

router.post('/changeUserInfo', async function(req, res) {
  var userid = "";
  if(req.Type.includes("patient"))
    userid = req.UserID;
  else
    userid = req.body.UserID;
  await User.updateOne({UserID: userid}, {Height: req.body.Height}, function (err, user) {
    if(err)
      common(res, err, err.message, null);
    else {
      if(user)
        common(res, false, null, user.DateOfSurgery);
      else
        common(res, false, "Not Found", null);
    }
  });
});



router.put('/patientUpdate', async function (req, res) {
    await User.getUserByUserID(req.UserID, async function (err, user) {
      if (user) {
        user.UserID = req.body.UserID || user.UserID;
        user.First_Name = req.body.First_Name || user.First_Name;
        user.Last_Name = req.body.Last_Name || user.Last_Name;
        user.Phone_Number = req.body.Phone_Number || user.Phone_Number;
        user.Gender = req.body.Gender || user.Gender;
        user.Smoke = req.body.Smoke || user.Smoke;
        user.SurgeryType = req.body.SurgeryType || user.SurgeryType;
        user.Education = req.body.Education || user.Education;
        user.Height = req.body.Height || user.Height;
        user.Weight = req.body.Weight || user.Weight;
        user.BMI = req.body.BMI || user.BMI;
        user.BirthDate = (new Date(req.body.BirthDate || user.BirthDate)).setHours(0, 0, 0, 0);
        user.DateOfSurgery = req.body.DateOfSurgery;
        user.Type = ["patient"];
        user.ValidTime = req.body.ValidTime || user.ValidTime;
        user.Timestamp = new Date().getTime();
        await User.updateUser(user, function (error) {
          if(error)
            common(res, error, error, null);
          else
            common(res,false,null,user);
        });
      } else {
        var error = {'message': 'Taken Email'};
        common(res, error, error, null);
      }
    });
});

router.put('/doctorUpdate', async function (req, res) {
  await User.getUserByUserID(req.UserID, async function (err, user) {
    if (user) {
      user.UserID = req.body.UserID || user.UserID;
      user.First_Name = req.body.First_Name || user.First_Name;
      user.Last_Name = req.body.Last_Name || user.Last_Name;
      user.Phone_Number = req.body.Phone_Number || user.Phone_Number;
      user.BirthDate = (new Date(req.body.BirthDate || user.BirthDate)).setHours(0, 0, 0, 0);
      user.Type = ["doctor"];
      user.ValidTime = req.body.ValidTime || user.ValidTime;
      user.Timestamp = new Date().getTime();
      await User.updateUser(user, function (error) {
        if(error)
          common(res, error, error, null);
        else
          common(res,false,null,user);
      });
    } else {
      var error = {'message': 'Taken Email'};
      common(res, error, error, null);
    }
  });
});

module.exports = router;
