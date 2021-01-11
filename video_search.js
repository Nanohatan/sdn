var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router()

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/', function(req, res) {
  //res.sendfile('static/video_search.html');
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("movieInfo");
  dbo.collection("movies").find({}, { projection: { _id: 0} }).limit(5).toArray(function(err, result) {
    if (err) throw err;
    db.close();
    res.render("video_search", {"jd":result})
  });
});
});

module.exports = router;

