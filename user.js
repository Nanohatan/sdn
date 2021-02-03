var express = require('express')
var router = express.Router()

// define the home page route
router.get('/', function (req, res) {
  var  sess = req.session.user;
  if (sess){
    res.render('userPage', {role:req.session.user.isTeacher, userName : req.session.user.name, schedule:req.session.user.class });
  }else{
    res.redirect('/auth/login');
  }
})

module.exports = router