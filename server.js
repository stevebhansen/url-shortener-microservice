// server.js
// where your nodvar url = 'mongodb://localhoste app starts

// init project
var express = require('express');
var app = express();
var mongodb = require('mongodb');
var getIP = require('ipware')().get_ip;


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
//var url = mongodb.MongoClient;
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + '@ds153392.mlab.com:53392/url-shortener-microservice-db';

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
  
});

app.get("/new/*", function(request, response) {
  var ua = request.headers['user-agent'];
  var ip = getIP(request);
  var url = request.params[0];
  //response.send({ua: ua, ip: ip['clientIp']});
  response.send(request.params[0]);
});

app.get("/*", function(request, response){
  response.send("hello steve");
});
// Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);

    // do some work here with the database.

    //Close connection
    db.close();
  }
});
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
