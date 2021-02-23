var express = require('express');
var router = express.Router();
var common = require('../common');
var Message = require('../../modules/Message');
const { v4: uuidv4 } = require('uuid');
var Exercise = require('../../modules/Exercise');


// router.get('/', async function (req, res) {
//     await Message.getUserMessages(req.UserID,function (err, messages) {
//         if(err)
//             common(res, true, err, null);
//         else
//             common(res, false, null, messages);
//     });
// });


router.post('/', async function (req, res) {
    // await User.getUserByUserID((req.UserID), async function (err, user) {
    //     if (err) {
    //         common(res, true, err, null);
    //         return;
    //     }
        const newVideo= new Exercise({
            ExerciseId :uuidv4(),
            Category :req.body.category,
            Video : req.body.url
        });
        await Exercise.createExercise(newVideo, function (err, exercise) {
            if (err)
                common(res, true, err, null);
            else
                common(res, false, null, {
                    ExerciseId: exercise.ExerciseId
                });
        });
    // });
});

// router.post('/removeMessage', async function (req, res) {
//     await User.getUserByUserID((req.UserID), async function (err, user) {
//         if (err) {
//             common(res, true, err, null);
//             return;
//         }
//         await Message.removeMessage(req.body.MessageId, function (err, message) {
//             if (err)
//                 common(res, true, err, null);
//             else
//                 common(res, false, null, {
//                     messageId: message.MessageId
//                 });
//         });
//     });
// });

// router.put('/updateMessage', async function (req, res) {
//     await User.getUserByUserID((req.UserID), async function (err, user) {
//         if (err) {
//             common(res, true, err, null);
//             return;
//         }
//         await Message.updateMessage(req.body.MessageId, req.body.Content, function (err, message) {
//             if (err)
//                 common(res, true, err, null);
//             else
//                 common(res, false, null, {
//                     messageId: message.MessageId
//                 });
//         });
//     });
// });


module.exports = router;