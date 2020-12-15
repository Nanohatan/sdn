var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router()

//mongodb
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get('/', function(req, res) {
  res.sendfile('static/auth.html');
});

router.get('/login', function(req, res) {
  if (req.cookies.uid==null){
    res.redirect('/auth')
  }else{
    var n,r;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("userInfo");
        dbo.collection("users").findOne({uid:req.cookies.uid}, function(err, result) {
	  if (err) throw err;
          if (result==undefined){
            res.redirect('/auth')
          }else {

          n=result.name;
          r=result.isTeacher;
	  console.log(result.name);
	  db.close();
          res.render("userPage.ejs", {"role": r,"userName":n})}
        });
    });
    //res.render("userPage.ejs", {"role": r,"userName":n})
  }
});

router.post('/post', urlencodedParser, function (req, res) {
//crate user account
 console.log(req.body)
 //set cookie
// res.cookie("email", req.body.email)
 res.cookie("uid", req.body.uid)

 //insert db (uid,role,email)


 res.send('post');
});

router.post('/createAccount',function(req,res){
  console.log(req.body)
  res.cookie("role", req.body.role)
  res.cookie("userName", req.body.userName)
  //db 


  res.render("userPage.ejs", {"role": req.body.role,"userName": req.body.userName})
})

module.exports = router;
