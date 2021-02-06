var express = require('express')
var router = express.Router()
const { MongoClient } = require("mongodb");
const uri = 'mongodb://localhost:27017' ;

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
      res.render('chat_body/thread',{main:parent_chat[0],jsonAry:child_chats}, function (err, html) {
        res.send(html)
      })

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