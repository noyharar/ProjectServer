const mongoose = require("mongoose");
const dbPath = "mongodb+srv://noyharari:noyharari@cluster0.vldcb.mongodb.net/modamedicDB";
const chalk = require("chalk");

const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;

// const conn = mongoose.createConnection(dbPath, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// });

const onError = () => {
    console.log(chalk.red("[-] Error occurred from the database roi"));
};

const onOpen = (db) => {
    gridFSBucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "instructions"
    });
    // Init stream
    gfs = Grid(db);
    gfs.collection("instructions");
    console.log(
        chalk.yellow(
            "[!] The database connection opened successfully in GridFS service"
        )
    );
};

let gfs, gridFSBucket;


const getGridFSFiles = id => {
    return new Promise((resolve, reject) => {
        gfs.files.findOne({ _id: mongoose.Types.ObjectId(id) }, (err, files) => {
            if (err) reject(err);
            // Check if files
            if (!files || files.length === 0) {
                resolve(null);
            } else {
                resolve(files);
            }
        });
    });
};

const createGridFSReadStream = id => {
    return gridFSBucket.openDownloadStream(mongoose.Types.ObjectId(id));
};

const deleteFile = id => {
    gridFSBucket.delete(mongoose.Types.ObjectId(id))
};

const storage = new GridFsStorage({
    url: process.env.MONGO_URL || dbPath,
    cache: true,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise(resolve => {
            const fileInfo = {
                filename: file.originalname,
                bucketName: "instructions"
            };
            resolve(fileInfo);
        });
    }
});

storage.on("connection", () => {
    console.log(chalk.yellow("[!] Successfully accessed the GridFS database"));
});

storage.on("connectionFailed", err => {
    console.log(chalk.red(err.message));
});

module.exports = mongoose;
module.exports.storage = storage;
module.exports.getGridFSFiles = getGridFSFiles;
module.exports.createGridFSReadStream = createGridFSReadStream;
module.exports.deleteFile = deleteFile;
module.exports.onError = onError;
module.exports.onOpen = onOpen;