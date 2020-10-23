var express = require('express');
var app = express();
var fs = require('fs');
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);


app.set('view engine', 'ejs');

app.use('/video', express.static('video'));
app.use('/static', express.static('static'));
app.use('/views', express.static('views'));


memers = []; //users array
memeConnections = []; //connections array
server.listen(process.env.PORT || 8080);
console.log("Meme Server Is Up"); 

app.get('/', function (req, res) {
    res.sendfile('static/index.html');
});

app.get('/test', function (req, res) {
    res.sendfile('static/test.html');
});


io.sockets.on("connection", function(socket){
	//connection stuff
	memeConnections.push(socket);	
				io.sockets.emit("new memer"); //checks if anyone is online

	console.log("Memers connected: %s", memeConnections.length);
	

	
	
	// disconnection stuff
	socket.on("disconnect", function(data){
		
		memers.splice(memers.indexOf(socket.username), 1); //accessing the array memers
		
						io.sockets.emit("memer left"); //checks if memer left

	memeConnections.splice(memeConnections.indexOf(socket),1);
	console.log("Memers disconnected: %s ", memeConnections.length);
	});
	
	//send dem meme messages
	socket.on("send meme message", function(data){ 
		console.log(data);// shows what the memers typed in console
		io.sockets.emit("new meme message", {msg: data});
	
	
	});



	});


//app.listen(8080)
