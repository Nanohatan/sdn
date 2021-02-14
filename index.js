var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

//ssetion関連
var session = require('express-session')
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000
  }
}));
app.use('/user', require('./user.js'));

//using auth
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use('/auth', express.static('static/auth'))
var auth = require('./auth.js')
app.use('/auth', auth);
app.use('/search', require('./video_search.js'))
app.use('/movie_upload', require('./movie_upload.js'))
app.use('/api', require('./chat_api.js'))


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
    res.sendfile('static/home.html');
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


var ObjectId = require('mongodb').ObjectID;
app.get("/api/likes/:id", async function (req, res) {
    //セッションからユーザーをとる
    const user=req.session.user
    const id=req.params.id
    const client = new MongoClient(url, { useUnifiedTopology: true });
  
    try {
      await client.connect();
  
      const database = client.db('chatInfo');
      const likes_collection = database.collection('likes');
      const chats_collection = database.collection('chats')
  
      const query = { chat_id:id,user:user._id };
      console.log(query)
      const cursor = await likes_collection.aggregate([
        { $match: query }
      ]);
      const like = await cursor.toArray();
      console.log(like)
      if (like.length==0){//初回
          //2.chatsのlikesを増やす
        await chats_collection.findOneAndUpdate(
          {_id:ObjectId(id)},
          { $inc: { rating: 1 } }
        )
        //likesにユーザー名とチャット名のデータをいれるf
        await likes_collection.insertOne({
          chat_id:id,
          user:user._id
        })
  
        res.send({msg:"exist",isInc:true})
      }else{
        //すでに押してる場合は、今回は変化せない。
        res.send({msg:"not exist",isInc:false})
      }
  
    } catch(err) {
      console.log(err);
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  
  
  
  });



