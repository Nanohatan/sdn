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
const test = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'test_kanon';
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
                place: sorce_url
            });
        });
    });
});

app.get('/top', function (req, res) {
    res.sendfile('static/top.html');
});

// io.sockets.on("connection", function (socket) {
//     //connection stuff
//     memeConnections.push(socket);
//     io.sockets.emit("new memer"); //checks if anyone is online
//
//     console.log("Memers connected: %s", memeConnections.length);
//
//
//     // disconnection stuff
//     socket.on("disconnect", function (data) {
//
//         memers.splice(memers.indexOf(socket.username), 1); //accessing the array memers
//
//         io.sockets.emit("memer left"); //checks if memer left
//
//         memeConnections.splice(memeConnections.indexOf(socket), 1);
//         console.log("Memers disconnected: %s ", memeConnections.length);
//     });
//
//     //send dem meme messages
//     socket.on("send meme message", function (data) {
//         console.log(data);// shows what the memers typed in console
//         io.sockets.emit("new meme message", {msg: data});
//
//
//     });
//
//
// });

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg,reaction) => {
        io.emit('chat message', msg, reaction);
        console.log('message: ' + msg + reaction);
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log(typeof(JSON.stringify(file.originalname)));

        puid = new Puid();
        puid = puid.generate();
        var dir = 'uploads/' + puid

        const connectOption = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
        MongoClient.connect(url, connectOption, function (err, client) {
            const col = client.db(dbName).collection('movies');
            col.insert([{id: puid, place: dir}], {w: 1}, function (err, result) {
                test.equal(null, err);
            });
        });
        // var dir = 'uploads/' + JSON.stringify(file.originalname);
        var fs = require('fs');
        if (!fs.existsSync(dir)) {
            //create dir
            var command = "mkdir -p " + dir;
            execSync(command);
            // fs.mkdir(dir);
            // Makedir(dir);
        }
        ;
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

app.use('/upload/', function (req, res, next) {
    res.sendfile('static/upload.html'); // the uploaded file object
    // res.send('<form action="/upload" method="POST" enctype="multipart/form-data">'+
    // '<input name="movie" type="file"/>'+
    // '<input type="submit" name="sub_buttono" value="Upload">'+'</form>');
    console.log("get upload");
});

app.post('/upload', upload.single('movie'), function (req, res, next) {
    console.log('post upload');
    console.log(req.body);
    console.log('req filepath:', req.file.path)
    // var req = JSON.stringify(req);
    // console.log('req.file:',req);
    createSegments(__dirname, req);
    console.log('createSegments END');
    // console.log(`req.body: ${JSON.stringify(req.file)}`);
    res.redirect("/userlist");
});


//functions
function createSegments(dir_name, req) {
    console.log('createSegments START');
    var f_dir = dir_name + "/" + req.file.destination + "/";
    var f_in_path = f_dir + req.file.filename;
    var f_out_dir = f_dir + 'video%3d.ts" ' + f_dir + 'playlist.m3u8';
    var command = 'ffmpeg -i ' + f_in_path + ' -codec copy -bsf:v h264_mp4toannexb -hls_time 9 -loglevel error -hls_list_size 0 -hls_segment_filename "' + f_out_dir;
    var result = execSync(command);
    // return 1
};


//app.listen(8080)
