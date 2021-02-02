var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

//ssetion関連
var session = require('express-session')
const app = express();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000
  }
}));
var sessionCheck = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};
app.use('/user', sessionCheck, require('./user.js'));

//using auth
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use('/auth', express.static('static/auth'))
var auth = require('./auth.js')
app.use('/auth', auth);
app.use('/search', require('./video_search.js'))
app.use('/movie_upload', require('./movie_upload.js'))


var Puid = require('puid');
var puid;

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

app.set('view engine', 'ejs');

app.use('/video', express.static('video'));
app.use('/static', express.static('static'));
app.use('/views', express.static('views'));
app.use('/uploads', express.static('uploads'));


memers = []; //users array
memeConnections = []; //connections array
server.listen(process.env.PORT || 8080);

app.get('/', function (req, res) {
    //res.render('index');
    res.sendfile('static/home.html');
});

app.get('/test', function (req, res) {
    res.sendfile('static/test.html');
});

app.get('/video/:id', function (req, res) {
    console.log(req.cookies.isTeacher);
    console.log('Signed Cookies: ', req.signedCookies)
    var sorce_url = "/uploads/" + req.params.id + "/playlist.m3u8";
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("movieInfo");
        var query = {movie_id: req.params.id};
        dbo.collection("movies").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            res.render('class_page', {
                role: false,
                className: result[0].lecture_name,
                videoTitle: result[0].lecture_name,
                videoNumber: result[0].lecture_time,
                place: sorce_url,
                movie_id: req.params.id
            });
        });
    });
});

app.get('/top', function (req, res) {
    res.sendfile('static/top.html');
});

var join_id;
io.on('connection', (socket) => {
    console.log('a user connected');

    console.log(socket.rooms);
    socket.on('join', function(id) {
        console.log(id);
        socket.join(id);
        // console.log("【参加した後のroom】")
        // console.log(socket.rooms)
    });

    socket.on("leave", (id) =>{
        console.log(id);
        socket.leave(id);
        // console.log("【去った後のroom】")
        // console.log(socket.rooms)
    });

    socket.on("check", () =>{
        console.log("【送られてきた奴らのrooms】")
        console.log(socket.rooms);
    });


    socket.on('chat message', (msg, reaction, id, isParent, shiori_time, nowTime) => {
        puid = new Puid();
        puid = puid.generate();
        console.log("【現在のroom】")
        console.log(socket.rooms)
        console.log("【送る先のid】")
        console.log(id)
        io.to(id).emit('chat message', msg, reaction, puid, isParent ,shiori_time, nowTime);
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("chatInfo");
            var chat_obj = {
                parent_id: id,
                its_id: puid,
                msg: msg,
                isWatchByTeacher: false,
                rating: 0,
                msg_type: reaction,
                isParent: isParent,
                shiori_time: shiori_time,
                video_time: nowTime
            };
            dbo.collection("chats").insertOne(chat_obj, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    });
});


app.use('/upload/', function (req, res, next) {
    //生徒はuploadいけないようにする．
    //できない
    if (!req.cookies.isTeacher){
        res.redirect("/");
    }else{
        res.render('uploads', {"class_name":req.query.class_name}); // the uploaded file object
    }
    // res.send('<form action="/upload" method="POST" enctype="multipart/form-data">'+
    // '<input name="movie" type="file"/>'+
    // '<input type="submit" name="sub_buttono" value="Upload">'+'</form>');
    console.log("get upload");
});





