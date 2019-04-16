const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

function getImages() {
    q =
        "SELECT url, title, id, username, description FROM images ORDER BY id DESC;";
    return db.query(q);
}

function addImage(url, username, title, description) {
    q =
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING id";
    params = [url, username, title, description];
    return db.query(q, params);
}

module.exports = {
    getImages,
    addImage
};
