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
    dbo.collection("movies").distinct("class_name", function(err, result){
      if (err){
        db.close();
        console.log(err);
      };
      res.render('video_search', {"class_name": result});
    });
  });
});

router.get('/testGet',function(req,res){
res.send("hallo");
});

router.get('/chats',function(req,res){
const chat_id=req.query.id;
const isWatchByTeacher= (req.cookies.isTeacher == 'true');
console.log(chat_id+isWatchByTeacher);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("chatInfo");
    var query = {};
    if (isWatchByTeacher){//先生verはisWatchByTeacherがtrueの物飲みとってくる
      query = {parent_id:chat_id,isWatchByTeacher:isWatchByTeacher};
    }else{query = {parent_id:chat_id};}//生徒ver isWatchByTeacherに関わらす、関連するチャットをとってくる
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
  c_name = req.params.name;
  const isWatchByTeacher= (req.cookies.isTeacher == 'true');
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //ここらへんでユーザー情報を取得したい．
    var dbo = db.db("movieInfo");
    var query = {class_name: c_name};
    dbo.collection("movies").find(query).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      //授業名をclass_nameで渡す． パラメータで渡された科目の講義の情報をjdで渡す．
      res.render("class_list_page", {"jd":result, "class_name":c_name, "role":isWatchByTeacher});
    });
  });
});

router.post('/class/add_schedule/:name', function(req, res){
  user_id = req.cookies.uid;
  c_name = req.params.name;
  var c_day;
  var c_period;
  MongoClient.connect(url, function(err, db) {
    var query = {class_name: c_name};
    var dbo = db.db('movieInfo');
    dbo.collection('movies').findOne(query, (function(err, result){
      if (err) throw err;
      c_day = result.day;
      c_period = result.period;
      var dbi = db.db('userInfo');
      var query_ = {$addToSet: {"class": {"day":c_day, "period":c_period, "class_name": c_name}}};
      dbi.collection('users').updateOne({"uid":user_id}, query_,function(){
      db.close();
      });
    }));
  })
  //科目のポータルサイトを表示するルーティングにリダイレクトしたいけどできん
  res.redirect('/');
});

