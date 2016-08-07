var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var os = require ('os');

var app = express();
app.use(cors());

console.log(process.env);

if (typeof process.env.VCAP_SERVICES != "undefined"){
        var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
        console.log(JSON.stringify(vcap_services));

        var dbhost = vcap_services.cleardb[0].credentials.hostname;
        var dbuser = vcap_services.cleardb[0].credentials.username;
        var dbpwd  = vcap_services.cleardb[0].credentials.password;
        var dbname = vcap_services.cleardb[0].credentials.name;
}
else {
        var dbhost = process.env.DBHOST;
        var dbuser = process.env.DBUSER;
        var dbpwd  = process.env.DBPWD ;
        var dbname = process.env.DBNAME;
}

app.get('/', function (req, res, next) {
  var result = 'Testing Jenkins continuous deployment of the Pricing Service on OpenShift Online on pod: ' + os.hostname();
  res.send(result);
});

app.get('/home/', function (req, res, next) {
  res.send('Welcome home!');
});

app.get('/prices/', function(req, res, next) {
        var con = mysql.createConnection({
                host: dbhost,
                user: dbuser,
                password: dbpwd,
                database: dbname
        });

        console.log('Connecting with below parameters');
        console.log(dbhost);
        console.log(dbuser);
        console.log(dbpwd);
        console.log(dbname);

        con.connect();

        var queryString = "Select * from PriceUpdates";

        con.query(queryString, function(err, rows, fields) {
                if (err)
                        throw err;
                else
                        res.send(rows);
        });

        con.end(function(err){
                //console.log(err);
        });
});

app.get('/prices/:scripid', function(req, res) {
        console.log('Scrip ID = ' + req.params.scripid);

        var con = mysql.createConnection({
                host: dbhost,
                user: dbuser,
                password: dbpwd,
                database: dbname
        });

        console.log('Connecting with below parameters');
        console.log(dbhost);
        console.log(dbuser);
        console.log(dbpwd);
        console.log(dbname);

        con.connect();

        var queryString = "Select * from PriceUpdates Where ScripID = ?";

        con.query(queryString, req.params.scripid, function(err, rows, fields) {
                if (err)
                        throw err;
                else
                        res.send(rows);
        });

        con.end(function(err){
                //console.log(err);
        });
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

