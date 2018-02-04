var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'app')));
/* app.set('views', __dirname + '/views'); */
/* app.use(express.static(path.join(__dirname, 'public'))); */

/* app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/lib/views/index.html'));
}); */

app.listen(8080, printListen);

function printListen() {
  console.log("Listening at port 8080");
}
