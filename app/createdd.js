(function () {
  getTables()
}());

var dictionaryID = localStorage.getItem("dictionaryID") //global dictionaryID variable - for use in submitting table

//Function to handle which table's addRow button has been clicked
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
      tableNameInput.className = "tableNameInput"

  var deleteBtn = document.createElement("p")
      deleteBtn.innerHTML = '&#10006'
      deleteBtn.className = "deleteTable"
      deleteBtn.addEventListener('click', deleteTable)


      //Construct table name HTML element
      tableName.appendChild(tableNameInput)
      tableName.appendChild(deleteBtn)
      tableNameRow.appendChild(tableName)

      // tableName.appendChild()
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
  newRowBtn.className = "mdl-button mdl-js-button mdl-button--raised"
  //Construct Button, build table
  buttonCell.appendChild(newRowBtn)
  buttonRow.appendChild(buttonCell)
  tbody.appendChild(buttonRow)


  newTable.append(tbody)
  newTable.className = "mdl-data-table mdl-js-data-table"
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

function deleteTable(e) {
  var currentTable = e.target.closest("table")
  currentTable.parentNode.removeChild(currentTable)
}

function generateSQL() {
  var SQLStrings = [];
  var tablesArray = document.getElementsByTagName('table')
  //tables[1].rows[0].cells[0].firstElementChild.value

  //loop through tables
  for (var i=0; i < tablesArray.length ; i++) {
    //loop through important rows with inputs
    for (var j=0; j < tablesArray[i].rows.length - 1; j++) {
      //Skip headers
      if (j==0) {
        var tabletoSQL; //Variable for storing the tables SQL


        tabletoSQL = "CREATE TABLE IF NOT EXISTS " + tablesArray[i].rows[j].cells[0].firstElementChild.value + " ("
      } else if (j==1) {
        continue;
      } else if (j >= 2) {

        //new attribute, add attribute name, data type
        tabletoSQL += "\n" + tablesArray[i].rows[j].cells[0].firstChild.value + " " +  tablesArray[i].rows[j].cells[2].firstElementChild.options[tablesArray[i].rows[j].cells[2].firstElementChild.selectedIndex].text


        //if there is a data size present, add brackets and add that

        if (tablesArray[i].rows[j].cells[3].firstElementChild.value.length != 0) {
          tabletoSQL += "(" + tablesArray[i].rows[j].cells[3].firstElementChild.value + ")"
        }

        //if primary key add that
        if (tablesArray[i].rows[j].cells[1].firstElementChild.options[tablesArray[i].rows[j].cells[1].firstElementChild.selectedIndex].text == "Primary Key") {
          tabletoSQL += " PRIMARY KEY"
        }

        //data constraints
        var checkboxes = tablesArray[i].rows[j].cells[4].firstElementChild.querySelectorAll('input')
        for (var x = 0; x < checkboxes.length; x++) {
          if (checkboxes[x].checked == true) {
            tabletoSQL += (" " + checkboxes[x].parentElement.textContent)
          }
        }

        //add comma if not last relevant row
        if (j != tablesArray[i].rows.length - 2) {
          tabletoSQL += ","
        }
        // console.log("The table is now " + tabletoSQL)
      }
    }
    tabletoSQL += "\n);"
    SQLStrings.push(tabletoSQL)
  }

  var SQLStrings = SQLStrings.join("\n")
  var SQLStrings = new Blob([SQLStrings], {type:"text/plain"});
  var SQLStringsURL = window.URL.createObjectURL(SQLStrings);
  var fileName = "generatedCode"

  var downloadLink = document.createElement("a");
  downloadLink.download = fileName;
  downloadLink.href = SQLStringsURL;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function submitTable() {
  var actualData = []
  console.log("submit table clicked")

  var tablesArray = document.getElementsByTagName('table')

  var newtestdata =[]
  for (var i=0; i < tablesArray.length ; i++) {

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
        newAttribute.push(tablesArray[i].rows[j].cells[0].firstChild.value)

        //table name
        newAttribute.push(tablesArray[i].rows[0].cells[0].firstElementChild.value)
        //this is a row, grab every cells value


        /*
        ADDING DATA DICTIONARY ID HERE BECAUSE ITS REQUIRED IN THE DATABASE
        */
        newAttribute.push(dictionaryID)

        //key if not = to None

        if (tablesArray[i].rows[j].cells[1].firstElementChild.options[tablesArray[i].rows[j].cells[1].firstElementChild.selectedIndex].text != "None") {
          newAttribute.push(tablesArray[i].rows[j].cells[1].firstElementChild.options[tablesArray[i].rows[j].cells[1].firstElementChild.selectedIndex].text)
        } else {
          newAttribute.push("")
        }

        //data type if not = to None
        newAttribute.push(tablesArray[i].rows[j].cells[2].firstElementChild.options[tablesArray[i].rows[j].cells[2].firstElementChild.selectedIndex].text)


        //data Size
        newAttribute.push(tablesArray[i].rows[j].cells[3].firstChild.value)

        //data constraints
        var checkboxes = tablesArray[i].rows[j].cells[4].firstElementChild.querySelectorAll('input')
        var constraints = "" //store constraints in a string

        for (var x = 0; x < checkboxes.length; x++) {
          if (checkboxes[x].checked == true) {

            console.log("this has run")
            constraints += (checkboxes[x].parentElement.textContent + ",")

          }
        }
        newAttribute.push(constraints)

        //reference for FK
        newAttribute.push(tablesArray[i].rows[j].cells[5].firstElementChild.value)

        //description of data
        newAttribute.push(tablesArray[i].rows[j].cells[6].firstElementChild.value)

        //add attribute to the table array
        newTable.push(newAttribute)

      }

    }

    newtestdata.push(newTable)
  }

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
  const response = fetch('/dataDictionary/updateDictionary', fetchOptions);
  if (!response.ok) {
    console.log(response.status)
    return;
  }
}

async function getTables() {
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
    addTable()
  }
}

async function getTableAttributes(tableName) {
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

  try {
    let response = await fetch('/dataDictionary/getAttributes', fetchOptions);
    let data = await response.text();
    return data
  } catch(err) {
    //catches errors both in fetch and response
    console.log(err);
  }

}

function insertData(data) {

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
          currentTable.rows[i+2].cells[1].firstElementChild.selectedIndex = j
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

      //attribute Constraints, split and slice so we're left with just the text of each
      var constraints = data[2][i].attributeConstraints.split(",").slice(0, -1)
      for (var y = 0; y < currentTable.rows[i+2].cells[4].querySelectorAll('li').length; y++) {
        for (var z = 0; z < constraints.length; z++) {
          if (currentTable.rows[i+2].cells[4].querySelectorAll('li')[y].textContent == constraints[z]) {
            currentTable.rows[i+2].cells[4].querySelectorAll('li')[y].firstElementChild.checked = true
          }
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
