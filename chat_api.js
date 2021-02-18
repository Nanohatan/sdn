var express = require('express')
var router = express.Router()
const { MongoClient } = require("mongodb");
const uri = 'mongodb://localhost:27017' ;
var bodyParser = require('body-parser');
const Puid = require('puid/lib/puid');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/get-thread/:id', async function (req, res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  var  sess = req.session.user;
  if (sess){
    try {
      await client.connect();
      const database = client.db('chatInfo');
      const collection = database.collection('chats');
      
      var child_chats = await collection.aggregate([
        { $match: {parent_id:req.params.id } }
      ]);
      var parent_chat = await collection.aggregate([
        { $match: {its_id:req.params.id } }
      ]);
      child_chats = await child_chats.toArray();
      parent_chat = await parent_chat.toArray();

      res.render('chat_body/thread',{main:parent_chat[0],jsonAry:child_chats})

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

router.get('/back-thread/:id', async function (req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    var  sess = req.session.user;
    if (sess && !sess.isTeacher){
      try {
        await client.connect();
        const database = client.db('chatInfo');
        const collection = database.collection('chats');
        
        var chats = await collection.aggregate([
          { $match: {parent_id:req.params.id } }
        ]);
        chats = await chats.toArray();
        console.log(chats)
        res.render('chat_body/main_thread',{jsonAry:chats})
  
      }catch(err) {
        console.log(err);
      }
      finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }else if (sess && sess.isTeacher){
      try {
        await client.connect();
        const database = client.db('chatInfo');
        const collection = database.collection('chats');
        
        var chats = await collection.aggregate([
          { $match: {parent_id:req.params.id ,isWatchByTeacher:true} }
        ]);
        chats = await chats.toArray();
        res.render('chat_body/main_thread',{jsonAry:chats})
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

  router.post('/switch_isWatchByTeacher/:id', async function (req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
      await client.connect();
      const database = client.db('chatInfo');
      const collection = database.collection('chats');
      const doc = collection.findOne({its_id:req.params.id});
      //its_idまたはparent_idが一致するものの閲覧状況を変更する。
      await collection.updateMany(
        {$or : [ {its_id:req.params.id } , {parent_id:req.params.id }] },
        {$set: {isWatchByTeacher: !doc.isWatchByTeacher}}
      )
      console.log(doc)
      
      res.json({isWatchByTeacher:doc.isWatchByTeacher})
    }catch(err) {
      console.log(err);
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }


})

router.post('/add_chat/:id',urlencodedParser, async function (req, res) {
  console.log(req.body)
  //DBに入れる
  const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
      await client.connect();
      const database = client.db('chatInfo');
      const collection = database.collection('chats');
      //子チャットの場合は閲覧範囲は親チャットと同じになるので、処理を入れる。
      const doc = collection.findOne({its_id:req.params.id});
      if (req.body.msg_type.auther==""){
        req.body.msg_type.auther="匿名"
      }
      //its_idまたはparent_idが一致するものの閲覧状況を変更する。
      var puid = new Puid();
      puid = puid.generate();
      await collection.insertOne({
        parent_id:req.params.id,
        its_id:puid,
        msg_type: req.body.msg_type,
        author: req.body.author,
        msg: req.body.msg,
        shiori_time: req.body.shiori_time,
        rating:0,
        isWatchByTeacher:false
      })
      console.log(doc)
      
      res.send({test:"test"})
    }catch(err) {
      console.log(err);
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
})
module.exports = router