var express = require('express')
var router = express.Router()
const { MongoClient } = require("mongodb");
const uri = 'mongodb://localhost:27017' ;

// define the home page route
router.get('/', function (req, res) {
  var  sess = req.session.user;
  if (sess){
    res.render('userPage', {role:req.session.user.isTeacher, userName : req.session.user.name, schedule:req.session.user.class });
  }else{
    res.redirect('/auth/login');
  }
})

router.get('/video/:id', async function (req, res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  var  sess = req.session.user;
  if (sess){
    try {
      await client.connect();
      var sorce_url = "/uploads/" + req.params.id + "/playlist.m3u8";
      
      const c_database = client.db('chatInfo');
      const c_collection = c_database.collection('chats');
      
      const query = { movie_id:req.params.id };
      var chats = await c_collection.aggregate([
        { $match: query }
      ]);
      chats = await chats.toArray();

      const m_database = client.db('movieInfo');
      const m_collection = m_database.collection('movies');
      const cursor = await m_collection.aggregate([
        { $match: query }
      ]);
      const movie = await cursor.toArray();
      
      res.render('video_page', 
      {role:req.session.user.isTeacher, 
        className: movie[0].class_name,
        videoTitle: movie[0].lecture_name,
        videoNumber: movie[0].lecture_time,
        place: sorce_url,
        movie_id: req.params.id,
        jsonAry:chats
      });
    }catch(err) {
      console.log(err);
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }else{
    res.redirect('/auth/login');
  }
})


module.exports = router