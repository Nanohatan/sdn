var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();

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
    res.render("userPage.ejs", {"role": "role set here","userName":"user name here"})
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
