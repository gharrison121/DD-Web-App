var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('app'));
/* app.set('views', __dirname + '/views'); */
/* app.use(express.static(path.join(__dirname, 'public'))); */

/* app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/lib/views/index.html'));
}); */

/*
Authentication

What to do here -

Ensure only clients who are signed in can view the application

Below is currently test code from the package, need to test & adapt
*/

var GoogleAuth = require('simple-google-openid')

app.use(GoogleAuth('525579174446-om8c829lbfhv4jb693327k9ot03e7nli.apps.googleusercontent.com'));

app.use('/api', GoogleAuth.guardMiddleware());

app.get('/api/hello', (req, res) => {
  res.send('Hello ' + (req.user.displayName || 'user without a name') + '!');

  console.log('successful authenticated request by ' + req.user.emails[0].value);
});

/*
---------------End of Authentication logic-----------------
*/

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
