const express = require("express");
const app = express();

const db = require("./db");
const s3 = require("./s3");

const config = require("./config");

app.use(require("body-parser").json());

app.use(express.static("./public"));

//for uploading
var multer = require("multer");
//for naming
var uidSafe = require("uid-safe");
//for finding file
var path = require("path");

var diskStorage = multer.diskStorage({
    //where uploaded files will be saved
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    // under what name images will be saved: random and unique
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.get("/board", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/more/:lastId", (req, res) => {
    db.getMoreImages(req.params.lastId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/uploading", uploader.single("file"), s3.upload, (req, res) => {
    const url = config.s3Url + req.file.filename;
    const username = req.body.username;
    const title = req.body.title;
    const description = req.body.description;

    db.addImage(url, username, title, description).then(idData => {
        let id = idData.rows[0].id;
        res.json({ id, url, username, title, description });
    });
});

app.get("/singleimage/:id", (req, res) => {
    const id = req.params.id;
    db.getSingleImage(id)
        .then(imageData => {
            const imageDetails = imageData.rows[0];
            return db.getComments(id).then(commentsData => {
                const comments = commentsData.rows;

                res.json({ imageDetails, comments });
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/comment", (req, res) => {
    db.addComment(req.body.comment, req.body.username, req.body.id).then(() => {
        res.json(req.body);
    });
});

app.get("*", (req, res) => {
    res.redirect("/");
});

app.listen(8080, () => {
    console.log("listening");
});
