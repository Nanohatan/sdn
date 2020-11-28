var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.sendfile('static/auth.html');
});

router.get('/login', function(req, res) {
  res.sendfile('static/test.html');
});

router.post('/post', function (req, res) {
 req.send('post');
});

module.exports = router;
