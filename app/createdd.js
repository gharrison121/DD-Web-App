console.log("Create DD Page")
squel = squel.useFlavour('mysql');

//Handles which add row button has been clicked
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
}

function deleteRow(e) {
  //get event source, delete row from which button was clicked
  var index = e.target.closest("tr").rowIndex
  var currentTable = e.target.closest("table")
  currentTable.deleteRow(index)
}

/*
Code Taken from https://hiddentao.com/squel/
 */

class CreateTableBlock extends squel.cls.Block {
  /** The method exposed by the query builder */
  table (name) {
      this._name = name;
  }

  /** The method which generates the output */
  _toParamString (options) {
    return {
        text:   this._name,
        values: [],  /* values for paramterized queries */
    };
  }
}

class CreateFieldBlock extends squel.cls.Block {
  constructor (options) {
    super(options);
    this._fields = [];
  }

  /** The method exposed by the query builder */
  field (name, type) {
    this._fields.push({
      name: name, type: type
    });
  }

  /** The method which generates the output */
  _toParamString (options) {
    let str = this._fields.map((f) => {
      return `${f.name} ${f.type.toUpperCase()}`;
    }).join(', ');

    return {
      text: `(${str})`,
      values: [],   /* values for paramterized queries */
    };
  }
}

class CreateTableQuery extends squel.cls.QueryBuilder {
  constructor (options, blocks) {
    super(options, blocks || [
      new squel.cls.StringBlock(options, 'CREATE TABLE'),
      new CreateTableBlock(options),
      new CreateFieldBlock(options),
    ]);
  }
}


/** Convenience method */
squel.create = function(options) {
  return new CreateTableQuery(options);
};

/*
End of code taken from https://hiddentao.com/squel/
*/

//Test function of squel.create()
console.log(
  squel.create()
      .table("customer")
      .field("name", "varchar(20)")
      .field("email", "varchar(20)")
      .field("phoneno", "varchar(20)")
      .field("sex", "char(1)")
      .toString()
);



function generateSQL() {
  var SQLStrings = [];
  var tablesArray = document.getElementsByTagName('table')
  // console.log(tablesArray)
  console.log("tablesarray length is " + tablesArray.length)
  //tables[1].rows[0].cells[0].firstElementChild.value

  //loop through tables
  for (var i=0; i < tablesArray.length ; i++) {
    console.log("first loop")
    //loop through important rows with inputs
    for (var j=0; j < tablesArray[i].rows.length - 1; j++) {
      console.log("second loop")
      //Skip headers
      if (j==0) {
        var tabletoSQL; //Variable for storing the tables SQL
        console.log (
          tabletoSQL = squel.create()
                      .table(tablesArray[i].rows[j].cells[0].firstElementChild.value)
        )
        console.log("second pass through " + tabletoSQL)
      } else if (j==1) {
        continue;
      } else if (j >= 2) {

        //grab values in cells 0, 2 and 3, really messy
        tabletoSQL.field(
            tablesArray[i].rows[j].cells[0].firstChild.value,
            tablesArray[i].rows[j].cells[2].firstElementChild.options[tablesArray[i].rows[j].cells[2].firstElementChild.selectedIndex].text +
            "(" + tablesArray[i].rows[j].cells[3].firstChild.value + ")")

        console.log("The table is now " + tabletoSQL.toString())
        SQLStrings.push(tabletoSQL.toString())

      }

    }
  }
}

//SubmitTable attempt
window.addEventListener("load", function() {
  console.log("load")
  function sendData() {

    var FD = new FormData(form)
    //perhaps just build FD from looping through table...


    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/testPost")
    xhr.send(FD)
  }

  // Access the form element...
var form = document.querySelector("form");

// ...and take over its submit event.
form.addEventListener("submit", function (event) {
  event.preventDefault();

  sendData();
});
})
