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
  database: "DDWEBAPP2"
});

app.use(GoogleAuth('525579174446-om8c829lbfhv4jb693327k9ot03e7nli.apps.googleusercontent.com'));
app.use(express.static('app'));

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//not sure? https://stackoverflow.com/questions/28724936/how-to-iterate-over-an-array-of-objects-in-the-request-body


app.get('/:pageID', function (req, res) {
  //send requested page ID file
  res.sendFile(__dirname + '/app/' + req.params.pageID + '.html');
})



app.post('/dataDictionary/updateDictionary', jsonParser, function(req, res) {
  //this can just be entered into the DB if we add ddtable name

  //should be 4 queries, one to delete all from ddtable where dictionaryID = the one given
  //another to delete all from attribute where dictionaryID = the one given
  //insert tables first... but we need dd ID
  //then attributes


  //each table
  var tableValues = []
  //each row from each table
  var attrValues = []

  //dictionaryValue will be the same across all, so just grab from first table
  var dictionaryValue = req.body[0][0][2]

  for (var i = 0; i < req.body.length; i++) {
    tableValues.push([req.body[i][0][1], Number(dictionaryValue)])
    for (var j = 0; j < req.body[i].length; j++) {
      attrValues.push(req.body[i][j])
    }
  }


  var query1 = "DELETE FROM ATTRIBUTE WHERE dictionaryID = ?"

  con.query(query1, dictionaryValue, function(err, result, fields) {
      if (err) throw err
      console.log(JSON.stringify(result))
  });

  var query2 = "DELETE FROM DDTABLE WHERE dictionaryID = ?"

  con.query(query2, dictionaryValue, function(err, result, fields) {
      if (err) throw err
      console.log(JSON.stringify(result))
  });

  var query3 = "INSERT INTO DDTABLE (tableName, dictionaryID) VALUES ?"

  con.query(query3, [tableValues], function(err, result, fields) {
      if (err) throw err
      console.log(JSON.stringify(result))
  });

  var query4 = "INSERT INTO ATTRIBUTE (attributeName, tableName, dictionaryID, attributeKey, attributeType, attributeSize, attributeConstraints, attributeRef, attributeDesc) VALUES ?"
    con.query(query4, [attrValues], function(err, result, fields) {
      if (err) throw err
      console.log(JSON.stringify(result))
    });
});

function testCon() {
  var query = "SELECT * FROM ACCOUNT;"
  con.query(query, function(err, result, fields){
    if (err) throw err;
    console.log(JSON.stringify(result))
  });
}

//----------------Database Routing----------------------
app.get('/dataDictionary/addUser', (req, res) => {

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
  var query = "INSERT IGNORE INTO DATADICTIONARY SET ?"

  con.query(query, value, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result.insertId))

  })

  //eventually res.send(result.insertID)
  //https://stackoverflow.com/questions/31371079/retrieve-last-inserted-id-with-mysql
});

app.post('/dataDictionary/removeDictionary', jsonParser, function(req, res) {
  var query = "DELETE FROM DATADICTIONARY WHERE dictionaryID = ?"
  var value = []
  value.push(req.body) //dictionaryID

  con.query(query, [value], function(err, result, fields) {
    if (err) throw err;
    console.log(JSON.stringify(result))
  })
});

app.listen(8080, printListen);

function printListen() {
  console.log("Listening at port 8080");
}

// app.post('/dataDictionary/generateSQL', jsonParser, function(req, res) {
//   var value = []
//   value.push(req.body.idNumber) //dictionaryID
//   var tablesArray;
//   var attributeArray
//   var query1 = "SELECT tableName FROM DDTABLE WHERE dictionaryID = ?"
//
//   con.query(query1, [value], function(err, tables, fields) {
//     if (err) throw err;
//     // console.log(JSON.stringify(result))
//     tablesArray = tables
//     for (var i=0; i < tables.length; i++) {
//       console.log(tables[i].tableName)
//       var sqlString = "CREATE TABLE IF NOT EXISTS " + tables[i].tableName + " ("
//
//       var query2 = "SELECT tableName, attributeName, attributeKey, attributeType, attributeSize, attributeConstraints, attributeRef, attributeDesc FROM ATTRIBUTE WHERE tableName = ?"
//
//       con.query(query2, [tables[i].tableName], function(err, attributes, fields) {
//         attributeArray = attributes
//         if (err) throw err;
//         console.log(i)
//         for (var j=0; j < attributes.length; j++) {
//
//           // console.log(attributes[j].tableName)
//           var attr = "\n" + attributes[j].attributeName + " " + attributes[j].attributeType
//
//           if (attributes[j].attributeSize != "") {
//             attr += "(" + attributes[j].attributeSize + ")"
//           }
//
//           if (attributes[j].attributeKey != "") {
//             attr += " " + attributes[j].attributeKey
//           }
//
//           if (attributes[j].attributesConstraints != "") {
//             var constraints = attributes[j].attributeConstraints.split(",").slice(0, -1)
//             for (var x=0; x < constraints.length; x++) {
//               attr += " " + constraints[x]
//             }
//           }
//
//           if (j != attributes.length - 1) {
//             attr += ","
//           }
//           sqlString += attr
//
//         }
//         sqlString += "\n);"
//         // console.log(sqlString)
//       })
//
//     }
//
//   })
// })
