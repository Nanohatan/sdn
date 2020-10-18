var express = require('express');
var app = express();

app.use('/video', express.static('video'));
app.use('/static', express.static('static'));

app.get('/', function (req, res) {
    res.sendfile('static/index.html');
});
app.get('/test', function (req, res) {
    res.sendfile('static/test.html');
});

app.listen(8080)