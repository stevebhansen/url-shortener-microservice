// server.js
// where your nodvar url = 'mongodb://localhoste app starts

// init project
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var validUrl = require('valid-url');
var getIP = require('ipware')().get_ip;


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
//var MongoClient = mongodb.MongoClient;
var url = 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + '@ds153392.mlab.com:53392/url-shortener-microservice-db';
var client = null;
/*
MongoClient.connect(url,function(err, db){
  if (err) throw err;
  var query = {_id: "url_counter"};
  db.collection("counters").find(query).toArray(function(err,results){
    if (err) throw err;
    console.log(results[0].sequence_value);
    db.close();
  });
});
*/

MongoClient.connect(url, function (err, db) {
  if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      client = db;
    }
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
  
});

app.get("/new/*", function(request, response) {
  getNextSequenceValue(function(count){
    var ua = request.headers['user-agent'];
    var ip = getIP(request);
    var url = request.params[0];
    var site = {ip: ip['clientIp'], url: url, createdAt: new Date(), url_count:count};
    if(validUrl.isUri(url)){
      writedb(site);
      //response.send({ua: ua, ip: ip['clientIp']});
      response.send({original_url: url, short_url: "https://cloudy-crib.glitch.me/" + count});
    }
    else{
      response.send(request.params[0] + " is an invalid url:  Please enter a url in the format of http://www.example.com");
    }
  });
});

app.get("/*", function(request, response){
  var short_u
});

var writedb = function (site){
  var collection = client.collection('microservice');
  collection.insert(site, function(err, data){
      if(err) throw err;
      console.log(JSON.stringify(site));
  });
}

var getNextSequenceValue = function(callback){
  var query = {_id: "url_counter"};
  client.collection("counters").findOneAndUpdate(query, {"$inc":{sequence_value:1}}, {upsert: true}, function(err,doc) {
     if (err) { throw err; }
     else { 
       console.log("Updated"); 
       console.log(doc.value.sequence_value);
       callback(doc.value.sequence_value)
     }
   });
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
