var express = require('express'); //using express for server
var app = express(); //init server
var path = require('path');
var bodyParser = require('body-parser') //parse json middleware
var jsonParser = bodyParser.json() //middleware
var GoogleAuth = require('simple-google-openid') //using GoogleAuth for authentication
var mysql = require('mysql'); //using mysql for DB solution
var con = mysql.createConnection({ //connection options to database
  host: "localhost",
  user: "root",
  password: "root",
  database: "DDWEBAPP"
});

app.use(GoogleAuth('525579174446-om8c829lbfhv4jb693327k9ot03e7nli.apps.googleusercontent.com'));
app.use(express.static('app'));

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//not sure? https://stackoverflow.com/questions/28724936/how-to-iterate-over-an-array-of-objects-in-the-request-body


/*
Authentication

What to do here -

Ensure only clients who are signed in can view the application

Below is currently test code from the package, need to test & adapt
*/

app.get('/:pageID', function (req, res) {
  // if (req.params.pageID != 'login') {
  //   // GoogleAuth.guardMiddleware()
  //   console.log("using guardMiddleware")
  // }

  //send requested page ID file
  res.sendFile(__dirname + '/app/' + req.params.pageID + '.html');
  // console.log("not login html")
})



app.post('/testPost', jsonParser, function(req, res) {
  //this can just be entered into the DB if we add ddtable name

  //insert tables first... but we need dd ID


  //this is each row from each table
  for (var i = 0; i < req.body.length; i++) {
    var query2 = "INSERT INTO ATTRIBUTE (attributeName, tableName, dictionaryID, attributeKey, attributeType, attributeSize, attributeConstraints, attributeRef, attributeDesc) VALUES ?"
    console.log(req.body[i])
    var values = req.body[i]

    con.query(query2, [values], function(err, result, fields) {
      if (err) throw err
      console.log(JSON.stringify(result))
    });
  }
});

function updateDictionary(req, res) {
  //log who request is from
  console.log("received post from: " + req.user.emails[0].value)
  var data = req.body
  console.log(req.body)
  // console.log(req.body.length)
  //example of accessing that data
  // console.log("received email2?: " + data[1].email)

  //we need to now add data to db
  /*
  this will involve a few queries

  one to add to the DDTABLE table
  loop through each attribute in table and make query for each

  */



  var sql = "INSERT INTO ATTRIBUTE (attributeName, tableName, dictionaryID, attributeKey, attributeType, attributeSize, attributeConstraints, attributeRef, attributeDesc) VALUES ?"

  var values;
  //works
  // data.forEach(function (table) {
  //   console.log(
  //     table.name + " \n" + table.attrName
  //
  //
  //   )
  // })
  };



function testCon() {
  var query = "SELECT * FROM ACCOUNT;"
  con.query(query, function(err, result, fields){
    if (err) throw err;
    console.log(JSON.stringify(result))
  });
}

//----------------Database Routing----------------------
app.get('/dataDictionary/addUser', (req, res) => {
  res.send('Hello ' + (req.user.emails[0].value) + '!');

  console.log('successful authenticated request by ' + req.user.emails[0].value);

  var sql = "INSERT IGNORE INTO ACCOUNT SET ?"
  var value = {
    userEmail: req.user.emails[0].value
  }
  con.query(sql, value, function(err, result, fields) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  })
});

app.get('/dataDictionary/myDictionaries', function(req, res) {
  var userEmail = req.user.emails[0].value
  var query = "SELECT dictionaryID, title, created FROM DATADICTIONARY WHERE userEmail = ?"

  con.query(query, [userEmail], function(err, result, fields) {
    if (err) throw err;
    console.log(JSON.stringify(result))
    if(result.length != 0) {
      res.send(result)
    } else {
      res.send("No dictionaries found matching your userID")
    }
  })
});

app.post('/dataDictionary/getTables', jsonParser, function(req, res) {
  //could run authentication here to ensure userEmail matches the one stored for the dictionaryID requested
  var userEmail = req.user.emails[0].value
  console.log("table request from: " + userEmail)

  //grab dictionaryID from request
  dictionaryID = req.body.idNumber
  console.log("dictionaryID: " + dictionaryID)

  //query database and find all tables matching dictionaryID supplied
  var query = "SELECT tableName FROM DDTABLE WHERE dictionaryID = ?"

  con.query(query, dictionaryID, function(err, result, fields) {
    if (err) throw err;
    console.log("result from get tables query is: " + JSON.stringify(result))
    if(result.length != 0) {
      res.send(result)
    } else {
      res.send("No tables found matching your dictionaryID")
    }
  })
})

app.post('/dataDictionary/getAttributes', jsonParser, function(req, res) {
  var userEmail = req.user.emails[0].value
  console.log("attribute request from: " + userEmail)
  tableName = req.body.name
  console.log("tableName request: " + tableName)
  var query = "SELECT attributeName, attributeKey, attributeType, attributeSize, attributeConstraints, attributeRef, attributeDesc FROM ATTRIBUTE WHERE tableName = ?"

  con.query(query, tableName, function(err, result, fields) {
    if (err) throw err;
    console.log("result from get attributes query is: " + JSON.stringify(result))
    if(result.length != 0) {
      res.send(result)
    } else {
      res.send("No attributes found matching your dictionaryID")
    }
  })

})

app.post('/dataDictionary/addDictionary', jsonParser, function(req, res) {

  console.log("dictionary submission from: " + req.user.emails[0].value)
  var value = {
    title: req.body.title,
    userEmail: req.user.emails[0].value
  }
  console.log(value)

  var query = "INSERT IGNORE INTO DATADICTIONARY SET ?"

  con.query(query, value, function(err, result, fields) {
    if (err) throw err;
    console.log("results from dictionary sub")
    console.log(JSON.stringify(result))
    console.log(JSON.stringify(result.insertId))
    res.send(JSON.stringify(result.insertId))

  })

  //eventually res.send(result.insertID)
  //https://stackoverflow.com/questions/31371079/retrieve-last-inserted-id-with-mysql
});

app.listen(8080, printListen);

function printListen() {
  console.log("Listening at port 8080");
}

testCon();
