var express = require('express');
var router = express.Router();
const { getGridFSFiles, createGridFSReadStream } = require("../instructionsUpload/my-gridfs-service");
const asyncWrapper = require("../instructionsUpload/async-wrapper");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ModaMedic' });
});

router.get(
    "/pdf/:id",
    asyncWrapper(async (req, res) => {
      const image = await getGridFSFiles(req.params.id);
      if (!image) {
        res.status(404).send({ message: "Image not found" });
      }
      res.setHeader('Content-disposition', 'attachment; filename=' + image.filename);
      res.setHeader("content-type", image.contentType);
      const readStream = createGridFSReadStream(req.params.id);
      readStream.pipe(res);
    })
);

module.exports = router;
