const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

function getImages() {
    q = "SELECT * FROM images ORDER BY id DESC LIMIT 3;";
    return db.query(q);
}

function getMoreImages(lastId) {
    q =
        "SELECT * , (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS lowest FROM images WHERE id < $1 ORDER BY id DESC LIMIT 3;";
    params = [lastId];
    return db.query(q, params);
}

function addImage(url, username, title, description) {
    q =
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING id";
    params = [url, username, title, description];
    return db.query(q, params);
}

function getSingleImage(id) {
    q = "SELECT * FROM images WHERE id=$1;";
    params = [id];
    return db.query(q, params);
}

function getComments(image_id) {
    q = "SELECT * FROM comments WHERE image_id=$1;";
    params = [image_id];
    return db.query(q, params);
}

function addComment(comment, username, image_id) {
    q =
        "INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3);";
    params = [comment, username, image_id];
    return db.query(q, params);
}

module.exports = {
    getImages,
    getMoreImages,
    addImage,
    getSingleImage,
    getComments,
    addComment
};
