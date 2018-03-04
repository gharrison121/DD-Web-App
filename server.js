var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'app')));
/* app.set('views', __dirname + '/views'); */
/* app.use(express.static(path.join(__dirname, 'public'))); */

/* app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/lib/views/index.html'));
}); */

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "DDWEBAPP"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

function testCon() {
  var query = "SELECT * FROM ACCOUNT;"
  con.query(query, function(err, result, fields){
    if (err) throw err;
    console.log(JSON.stringify(result))
  });
}



app.listen(8080, printListen);

function printListen() {
  console.log("Listening at port 8080");
}

testCon();
