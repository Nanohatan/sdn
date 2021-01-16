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
router.get('/testGet',function(req,res){
res.send("hallo");
});

router.get('/chats',function(req,res){
var chat_id=req.query.id;
console.log(chat_id);
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("chatInfo");
  var query = {parent_id:chat_id};
  dbo.collection("chats").find(query, { projection: { _id: 0} }).toArray(function(err, result) {
    if (err) throw err;
    db.close();
    console.log(result);
    res.send(result);
  });
});
});
module.exports = router;

router.get('/class/:name', function(req, res) {
  //res.sendfile('static/video_search.html');
  class_name = req.params.name
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("movieInfo");
    var query = {movie_id: class_name};
    dbo.collection("movies").find(query).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      //授業名をclass_nameで渡す． パラメータで渡された科目の講義の情報をjdで渡す．
      res.render("class_list_page", {"jd":result, "classs_name":class_name});
    });
  });
});