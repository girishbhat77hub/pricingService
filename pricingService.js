var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var os = require ('os');

var app = express();
app.use(cors());

app.get('/home/', function (req, res, next) {
  res.send('Welcome home!');
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

