var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

const multer = require('multer');
var busboy = require("connect-busboy");
const path = require("path");
const {chdir} = require('process');
let execSync = require('child_process').execSync;

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

io.on('connection', (socket) => {
    var join_id;
    socket.on('join', function(id) {
        console.log(socket.rooms);
        socket.leave(socket.id);
        join_id = id;
        socket.join(join_id);
        console.log("??");
        console.log(socket.id);
        console.log(socket.rooms);

    });

    socket.on("leave", (id) =>{
        socket.leave(id);
    });

    console.log('a user connected');
    socket.on('chat message', (msg, reaction, id, isParent, shiori_time, nowTime) => {
        puid = new Puid();
        puid = puid.generate();
        socket.emit("leave",join_id);
        console.log(join_id);
        console.log(socket.rooms);
        socket.leave(join_id);
        join_id = id;
        socket.join(join_id);
        console.log("きてうる！！！！！！！！！！！！！！！！！！！！");
        console.log(join_id)
        console.log(socket.rooms);
        io.to(join_id).emit('chat message', msg, reaction, puid, isParent ,shiori_time, nowTime);
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
        socket.join(join_id);
    });
});


app.use('/upload/', function (req, res, next) {
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




