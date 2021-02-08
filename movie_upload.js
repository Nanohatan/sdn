var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router()

var multer  = require('multer')

const path = require("path");
let execSync = require('child_process').execSync;
var Puid = require('puid');
var puid;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    puid = new Puid();
    puid = puid.generate();
    var dir = 'uploads/' + puid

    const connectOption = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
    }

    var fs = require('fs');
    if (!fs.existsSync(dir)) {
      //create dir
      var command = "mkdir -p "+dir;
      execSync(command);
      // fs.mkdir(dir);
      // Makedir(dir);
    };
    cb(null, dir);
  },
  filename: (req, file, cb) => {
      file.movie_id=puid
      console.log(file);
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage});
//var upload = multer({ dest: 'uploads/' })

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/',function(req, res,next) {
  var user=req.session.user
  if (user && user.isTeacher){
    console.log(req.session.user);
    res.render('uploads', {"class_name":req.query.class_name});
  }else{
    res.redirect("/user")
  }
});

router.post('/', upload.single('movie'),function(req, res,next) {
 // console.log(req.body,req.file);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("movieInfo");
    var obj = {movie_id:req.file.movie_id, lecture_name:req.body.lecture_name, lecture_time:req.body.lecture_time,day:req.body.day ,period:req.body.period, class_name:req.body.class_name};
    var obj = { name: req.body.class_name, lecture_year: req.body.lecture_year, semester: req.body.semester, teacher_id: "601a4634c1d7cdbb7336fcd2", day: req.body.day, timetable: req.body.timetable, is_archive: false, student_id: [], lectures: [ { time: lecture_time, video_id: req.file.movie_id, subtitle: req.body.lecture_name} ] };
    // teacher_idはセッションからとる．
    // var obj = { name: "コレクティブインテリジェンス", lecture_year: "2020", semester: "2", teacher_id: "601a4634c1d7cdbb7336fcd2", day: "5", timetable: ["1","2"], is_archive: false, student_id: ["5fd87210335edb82edcae756"], lectures: [ { time: "1", video_id: "", subtitle: "アリの行動と集合知"} ] };
    //var obj = { lecture_name:"Company Inc", lecture_time:0,day:"monday" ,period:2};
    dbo.collection("movies").insertOne(obj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
    createSegments(__dirname, req);
  });
});

//functions
function createSegments(dir_name, req){
  console.log('createSegments START');
  var f_dir = dir_name + "/" + req.file.destination + "/";
  var f_in_path = f_dir + req.file.filename;
  var f_out_dir = f_dir + 'video%3d.ts" ' + f_dir + 'playlist.m3u8';
  var command = 'ffmpeg -i ' + f_in_path + ' -codec copy -bsf:v h264_mp4toannexb -hls_time 9 -loglevel error -hls_list_size 0 -hls_segment_filename "'+ f_out_dir;
  var result =  execSync(command);
  // return 1
};

module.exports = router;
