
const MongoClient = require('mongodb').MongoClient;

const test = require('assert');

// Connection url

const url = 'mongodb://localhost:27017';

// Database Name

const dbName = 'test_kanon';

// Connect using MongoClient

const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

MongoClient.connect(url, connectOption, function(err, client) {

const col = client.db(dbName).collection('createIndexExample1');

// Show that duplicate records got dropped

col.find({a:1}).toArray(function(err, items) {

console.log(items);
client.close();
});

});
