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

MongoClient.connect(url,function(err, db){
  var results = db.collection("counters").find({"_id":"url_counter"})
  console.log(db.collection("counters").getIndexes())
  
})

/*
MongoClient.connect(url, function (err, db) {
  if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      client = db;
      var collection_counter = db.collection('counter');
      var test = collection_counter.find();
      console.log(test[0]);
      
      
      
    }
});
*/
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
  
});

app.get("/new/*", function(request, response) {
  getNextSequenceValue("url_counter", function(count){
    console.log(count);
    var ua = request.headers['user-agent'];
    var ip = getIP(request);
    var url = request.params[0];
    var site = {ip: ip['clientIp'], url: url, createdAt: new Date(), url_count:count};
    if(validUrl.isUri(url)){
      writedb(site);
      response.send({ua: ua, ip: ip['clientIp']});
    }
    else{
      response.send(request.params[0] + " is an invalid url:  Please enter a url in the format of http://www.example.com");
    }
  });
});

app.get("/*", function(request, response){
  response.send("hello steve");
});

var writedb = function (site){
  var collection = client.collection('microservice');
  collection.insert(site, function(err, data){
      if(err) throw err;
      console.log(JSON.stringify(site));
  });
  console.log(collection.find().toArray(function(err, items) {}));
}

var getNextSequenceValue = function(sequenceName, callback){
  var collection_counter = client.collection(sequenceName);
  var sequenceDocument = collection_counter.findAndModify({
      query:{_id: 'url_counter' },
      update: {$inc:{sequence_value:1}},
      new:true
   });
  console.log(sequenceDocument.sequence_value);
	if(typeof callback === "function"){
    callback(sequenceDocument.sequence_value);
  }
   
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
