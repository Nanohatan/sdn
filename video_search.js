var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router()


router.get('/', function(req, res) {
  res.sendfile('static/video_search.html');
});

module.exports = router;

