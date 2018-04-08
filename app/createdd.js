console.log("Create DD Page")
// squel = squel.useFlavour('mysql');

var dictionaryID = localStorage.getItem("dictionaryID") //global dictionaryID variable - for use in submitting table
console.log("dictionaryID is: " + dictionaryID)


//Function which handles which table's addRow button has been clicked
function idHandler(e) {
  console.log(e.target)
  addRow(e.target)
}

function addRow(id) {
  console.log("addrow function")
  currentTable = id.closest("tbody")

  //insert new row before the add row button
  var newRow = currentTable.insertRow(currentTable.rows.length - 1)

  //Loop through each column in the table and create cell
  for (var i=0; i < 8; i++) {
    var cell = newRow.insertCell(i)
    //Columns have different input types
    if (i == 1) {
      var validInputs = ['None', 'Primary Key', 'Foreign Key', 'Candidate Key']
      var select = document.createElement("select")
      for (var j in validInputs) {
        var option = document.createElement("option")
        option.value = validInputs[j]
        option.text = validInputs[j]
        select.appendChild(option)
        cell.append(select)
      }
    } else if (i == 2) {
      var validInputs = ['Int', 'VARCHAR', 'More']
      var select = document.createElement('select')

      //Loop through the validInputs and create an option for each
      for (var j in validInputs) {
        var option = document.createElement('option')
        option.value = validInputs[j]
        option.text = validInputs[j]
        select.appendChild(option)
        cell.append(select)
      }
    } else if (i == 4) {
      // create checkboxes for constraints
      var validConstraints = ['AUTO_INCREMENT', 'NOT NULL', 'UNIQUE']
      var listHolder = document.createElement('ul')
      for (var x in validConstraints) {
        var listItem = document.createElement('li')
        var checkbox = document.createElement('input')
        checkbox.type = "checkbox"
        listItem.textContent = validConstraints[x]
        listItem.appendChild(checkbox)
        listHolder.appendChild(listItem)
        cell.append(listHolder)
      }

    } else if (i == 7) {
      var button = document.createElement("button")
      button.innerHTML = '<i class="material-icons">&#xE15B;</i>'
      button.className = 'mdl-button mdl-js-button mdl-button--raised'
      button.addEventListener('click', deleteRow)
      componentHandler.upgradeElement(button)
      cell.append(button)
    } else {
      var input = document.createElement("input")
      input.type = "text"
      cell.append(input)
    }
  }
}

function addTable() {
  console.log("addtable run")
  var newTable = document.createElement("table"),
      tbody = document.createElement("tbody"),
      tableNameRow = document.createElement("tr"),
      tableName = document.createElement("th")
      tableName.colSpan = 2

  var tableNameInput = document.createElement("input")
      tableNameInput.type = "text"
      tableNameInput.value = "Table Name"

      //Construct table name HTML element
      tableNameRow.appendChild(tableName)
      tableName.appendChild(tableNameInput)
      tbody.appendChild(tableNameRow)

  var headersRow = document.createElement("tr"),
      headers = ['Attribute Name', 'Key', 'Data Type', 'Data Size',
                'Domain and Constraints', 'FK Reference', 'Data Description']
  //loop to number of cols in a table, create headers for each
  for (var i = 0; i < 7; i++) {
    var rowHeader = document.createElement("th")
    rowHeader.innerHTML = headers[i]
    headersRow.appendChild(rowHeader)
  }
  //Add column headers to constructed tbody
  tbody.appendChild(headersRow)

  //Add the 'Add Row' button
  var newRowBtn = document.createElement("button"),
      buttonRow = document.createElement("tr"),
      buttonCell = document.createElement("td")

  newRowBtn.innerHTML = "Add Row"
  newRowBtn.className = 'mdl-button mdl-js-button mdl-button--raised'
  //Construct Add Row Button, build table
  buttonCell.appendChild(newRowBtn)
  buttonRow.appendChild(buttonCell)
  tbody.appendChild(buttonRow)
  newTable.append(tbody)
  newTable.className = 'mdl-data-table mdl-js-data-table'
  componentHandler.upgradeElement(newTable)
  //Add new table to the document
  document.getElementById("content").appendChild(newTable)

  //Event listener for 'Add Row' button on new table
  newRowBtn.addEventListener("click", idHandler)

  //Add a new row to the new table by default
  newRowBtn.click();

  return [currentTable, newRowBtn]; //for use with loading in getTables()

}

// console.log(addTable())

function deleteRow(e) {
  //get event source, delete row from which button was clicked
  var index = e.target.closest("tr").rowIndex
  var currentTable = e.target.closest("table")
  currentTable.deleteRow(index)
}

/*
Code Taken from https://hiddentao.com/squel/
 */

// class CreateTableBlock extends squel.cls.Block {
//   /** The method exposed by the query builder */
//   table (name) {
//       this._name = name;
//   }
//
//   /** The method which generates the output */
//   _toParamString (options) {
//     return {
//         text:   this._name,
//         values: [],  /* values for paramterized queries */
//     };
//   }
// }
//
// class CreateFieldBlock extends squel.cls.Block {
//   constructor (options) {
//     super(options);
//     this._fields = [];
//   }
//
//   /** The method exposed by the query builder */
//   field (name, type) {
//     this._fields.push({
//       name: name, type: type
//     });
//   }
//
//   /** The method which generates the output */
//   _toParamString (options) {
//     let str = this._fields.map((f) => {
//       return `${f.name} ${f.type.toUpperCase()}`;
//     }).join(', ');
//
//     return {
//       text: `(${str})`,
//       values: [],   /* values for paramterized queries */
//     };
//   }
// }
//
// class CreateTableQuery extends squel.cls.QueryBuilder {
//   constructor (options, blocks) {
//     super(options, blocks || [
//       new squel.cls.StringBlock(options, 'CREATE TABLE'),
//       new CreateTableBlock(options),
//       new CreateFieldBlock(options),
//     ]);
//   }
// }
//
//
// /** Convenience method */
// squel.create = function(options) {
//   return new CreateTableQuery(options);
// };
//
// /*
// End of code taken from https://hiddentao.com/squel/
// */
//
// //Test function of squel.create()
// console.log(
//   squel.create()
//       .table("customer")
//       .field("name", "varchar(20)")
//       .field("email", "varchar(20)")
//       .field("phoneno", "varchar(20)")
//       .field("sex", "char(1)")
//       .toString()
// );
//
// function generateSQL() {
//   var SQLStrings = [];
//   var tablesArray = document.getElementsByTagName('table')
//   console.log("tablesarray length is " + tablesArray.length)
//   //tables[1].rows[0].cells[0].firstElementChild.value
//
//   //loop through tables
//   for (var i=0; i < tablesArray.length ; i++) {
//     console.log("first loop")
//     //loop through important rows with inputs
//     for (var j=0; j < tablesArray[i].rows.length - 1; j++) {
//       console.log("second loop")
//       //Skip headers
//       if (j==0) {
//         var tabletoSQL; //Variable for storing the tables SQL
//         console.log (
//           tabletoSQL = squel.create()
//                       .table(tablesArray[i].rows[j].cells[0].firstElementChild.value)
//         )
//         console.log("second pass through " + tabletoSQL)
//       } else if (j==1) {
//         continue;
//       } else if (j >= 2) {
//
//         //grab values in cells 0, 2 and 3, really messy
//         tabletoSQL.field(
//             tablesArray[i].rows[j].cells[0].firstChild.value,
//             tablesArray[i].rows[j].cells[2].firstElementChild.options[tablesArray[i].rows[j].cells[2].firstElementChild.selectedIndex].text +
//             "(" + tablesArray[i].rows[j].cells[3].firstChild.value + ")")
//
//         console.log("The table is now " + tabletoSQL.toString())
//         SQLStrings.push(tabletoSQL.toString())
//
//       }
//
//     }
//   }
// }

function submitTable() {
  var actualData = []
  console.log("submit table clicked")

  var tablesArray = document.getElementsByTagName('table')

  // var testdata = [['hello', 'hello2', 'hello3']]

  var newtestdata =[]
  for (var i=0; i < tablesArray.length ; i++) {
    // var table = {}
    // table.attrName = []
    // table.attrType = []
    // table.attrSize = []
    // table.attrConstraints = []
    // table.attrRef = []
    // table.attrDesc = []

    var newTable = []
    //loop through important rows with inputs
    for (var j=0; j < tablesArray[i].rows.length - 1; j++) {
      var newAttribute = []

      if (j==0) {
        // table.name = tablesArray[i].rows[j].cells[0].firstElementChild.value

        //Skip headers row in table
      } else if (j==1) {
        continue;
      } else if (j >= 2) {

        //attr name
        // table.attrName.push(tablesArray[i].rows[j].cells[0].firstChild.value)
        newAttribute.push(tablesArray[i].rows[j].cells[0].firstChild.value)

        //table name
        newAttribute.push(tablesArray[i].rows[0].cells[0].firstElementChild.value)
        //this is a row, grab every cells value




        /*
        ADDING DATA DICTIONARY ID HERE BECAUSE ITS REQUIRED IN THE DATABASE, GIVING DEFAULT VALUE WHICH WOULD REQUIRE CHANGING
        */
        newAttribute.push(dictionaryID)

        //key if not = to None

        if (tablesArray[i].rows[j].cells[1].firstElementChild.options[tablesArray[i].rows[j].cells[1].firstElementChild.selectedIndex].text != "None") {
          // table.attrType.push(tablesArray[i].rows[j].cells[1].firstElementChild.options[tablesArray[i].rows[j].cells[1].firstElementChild.selectedIndex].text)
          newAttribute.push(tablesArray[i].rows[j].cells[1].firstElementChild.options[tablesArray[i].rows[j].cells[1].firstElementChild.selectedIndex].text)
        } else {
          // table.attrType.push("")
          newAttribute.push("")
        }

        //data type if not = to None
        // table.attrType.push(tablesArray[i].rows[j].cells[2].firstElementChild.options[tablesArray[i].rows[j].cells[2].firstElementChild.selectedIndex].text)
        newAttribute.push(tablesArray[i].rows[j].cells[2].firstElementChild.options[tablesArray[i].rows[j].cells[2].firstElementChild.selectedIndex].text)


        //data Size
        // table.attrSize.push(tablesArray[i].rows[j].cells[3].firstChild.value)
        newAttribute.push(tablesArray[i].rows[j].cells[3].firstChild.value)

        //data constraints
        var checkboxes = tablesArray[i].rows[j].cells[4].firstElementChild.querySelectorAll('input')
        var constraints = "" //store constraints in a string

        for (var x = 0; x < checkboxes.length; x++) {
          if (checkboxes[x].checked == true) {

            console.log("this has run")
            constraints += (checkboxes[x].parentElement.textContent + " ")

          }
        }

        // table.attrConstraints.push(constraints)
        newAttribute.push(constraints)

        //reference for FK
        // table.attrRef.push(tablesArray[i].rows[j].cells[5].firstElementChild.value)
        newAttribute.push(tablesArray[i].rows[j].cells[5].firstElementChild.value)

        //description of data
        // table.attrDesc.push(tablesArray[i].rows[j].cells[6].firstElementChild.value)
        newAttribute.push(tablesArray[i].rows[j].cells[6].firstElementChild.value)

        newTable.push(newAttribute)

      }

    }

    newtestdata.push(newTable)
    // actualData.push(table)
    console.log("new test data next")

  }
console.log(newtestdata)
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    body: JSON.stringify(newtestdata),
    headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
  };
  const response = fetch('/testPost', fetchOptions);
  if (!response.ok) {
    console.log(response.status)
    return;
  }
}

/*
NEXT UP: TRY DATA INSERTION INTO THE THING
*/

async function getTables() {
  // console.log("getTables has run")
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  var payload = {
    idNumber: dictionaryID
  }
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    body: JSON.stringify(payload),
    headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
  };
  const response = await fetch('/dataDictionary/getTables', fetchOptions);
  if (!response.ok) {
    console.log(response.status)
    return;
  }

  //response contains all tables
  const data = await response.text();
  //hacky approach but my brain hurts
  if (data != "No tables found matching your dictionaryID") {
    parsedData = JSON.parse(data)

    for (var i=0; i < parsedData.length; i++) {
      var tableMetaData = addTable()
      var currentTable = tableMetaData[0]
      var newRowButton = tableMetaData[1]
      var dataForInsert = []
      dataForInsert.push(currentTable)


      dataForInsert.push(parsedData[i])

      //there is a table on the page by default, so need one less table added
      // if (i < parsedData.length -1) {
        //COULD GRAB FIRSTs ROW BUTTON HERE AND STORE IT
        // var firstAddRow = document.getElementById('addrow1')


        // console.log("the table: ")
        // console.log(currentTable)
      // }

      //call getTableAttributes
      var attributes = await getTableAttributes(parsedData[i].tableName)

      //hacky approach again
      if(attributes != "No attributes found matching your dictionaryID") {
        var parsedAttributes = JSON.parse(attributes)
        var tableAttributes = []
        for (var j=0; j < parsedAttributes.length; j++) {
          tableAttributes.push(parsedAttributes[j])
          dataForInsert.push(tableAttributes)

          //there is a row added by each table automatically, so need one less row added
          if(j < parsedAttributes.length - 1) {
            newRowButton.click()
          }
        }
      } else {
        console.log(attributes)
      }
      insertData(dataForInsert)
    }
  } else {
    console.log("no tables found")
  }
}

async function getTableAttributes(tableName) {
  // console.log("getTableAttributes has run")
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  var payload = {
    name: tableName
  }
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    body: JSON.stringify(payload),
    headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
  };
  // const response = await fetch('/dataDictionary/getAttributes', fetchOptions);

  try {
    let response = await fetch('/dataDictionary/getAttributes', fetchOptions);
    let data = await response.text();
    return data
  } catch(err) {
    // catches errors both in fetch and response.json
    alert(err);
  }

  // if (!response.ok) {
  //   console.log("response not okay?")
  //   console.log(response.status)
  //   return;
  // }

  //response contains all attributes belonging to the tableName supplied
  // const data = await response.text();
  // console.log(data)
  //hacky approach again
  // if (data != "No attributes found matching your dictionaryID") {
  //   // console.log("found")
  //   parsedData = JSON.parse(data)
  //   return parsedData;
  // } else {
  //   // console.log("not found")
  //   return;
  // }

  /*
  FROM HERE -> FOR EACH ATTRIBUTE RUN addRow() to appropriate table
  */
}

function insertData(data) {
  console.log("insertData has run")

  var currentTable = data[0]
  currentTable.rows[0].querySelectorAll('input')[0].value = data[1].tableName

  //loop through data
  //if there are attributes belonging to a table -- attributes sit at position 2 in array
  if (data[2]) {
    for (var i = 0; i < data[2].length; i++) {
      //attribute Name
      currentTable.rows[i+2].querySelectorAll('input')[0].value = data[2][i].attributeName

      //Key Type
      for (var j = 0; j < currentTable.rows[i+2].cells[1].querySelectorAll('option').length; j++) {

        if (currentTable.rows[i+2].cells[1].querySelectorAll('option')[j].value == data[2][i].attributeKey) {
          currentTable.rows[i+2].cells[1].firstElementChild.selectedIndex = j // fix this

        }
      }

      //Data Type
      for (var x = 0; x < currentTable.rows[i+2].cells[2].querySelectorAll('option').length; x++) {
        if (currentTable.rows[i+2].cells[2].querySelectorAll('option')[x].value == data[2][i].attributeType) {
          currentTable.rows[i+2].cells[2].firstElementChild.selectedIndex = x
        }
      }

      //attribute Data Size
      currentTable.rows[i+2].querySelectorAll('input')[1].value = data[2][i].attributeSize

      //attribute Constraints
    for (var y = 0; y < currentTable.rows[i+2].cells[4].querySelectorAll('li').length; y++) {
        if (currentTable.rows[i+2].cells[4].querySelectorAll('li')[y].textContent == data[2][i].attributeConstraints) {
          currentTable.rows[i+2].cells[4].querySelectorAll('li')[y].firstElementChild.checked = true
        }
      }


      //attribute Ref
      currentTable.rows[i+2].querySelectorAll('input')[5].value = data[2][i].attributeRef

      //attribute Description
      currentTable.rows[i+2].querySelectorAll('input')[6].value = data[2][i].attributeDesc
    }
  } else {
    return;
  }





}


(function () {
  getTables()
}());
