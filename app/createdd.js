console.log("Create DD Page")
squel = squel.useFlavour('mysql');

//ID Getters
// var addrow = document.getElementById("addrow")
// var ddtable = document.getElementById("datadictionary")
//Event Listeners
// addrow.addEventListener("click", addRow)

//Handles which add row button has been clicked
function idHandler(e) {
  console.log(e.target)
  addRow(e.target)
}

function addRow(id) {
  console.log("addrow function")
  //Commented out ID user, now just uses element
  // var rowBtn = document.getElementById(id)
  currentTable = id.closest("tbody")
  // var newRow = document.createElement("tr")
  var newRow = currentTable.insertRow(currentTable.rows.length - 1)

  //Loop through each column in the table and create cell
  for (var i=0; i < 8; i++) {
    // var cell = document.createElement("td")
    var cell = newRow.insertCell(i)
    //Columns have different input types
    if (i == 1) {
      var validInputs = ['Primary Key', 'Foreign Key', 'Candidate Key']
      var select = document.createElement("select")
      for (var j in validInputs) {
        var option = document.createElement("option")
        option.value = validInputs[j]
        option.text = validInputs[j]
        select.appendChild(option)
        cell.append(select)
        // newRow.appendChild(cell)
      }
    } else if (i == 2) {
      var validInputs = ['Int', 'VARCHAR', 'More']
      var select = document.createElement("select")

      //Loop through the validInputs and create an option for each
      for (var j in validInputs) {
        var option = document.createElement("option")
        option.value = validInputs[j]
        option.text = validInputs[j]
        select.appendChild(option)
        cell.append(select)
        // newRow.appendChild(cell)
      }
    } else if (i == 7) {
      var input = document.createElement("input")
      input.type = "checkbox"
      cell.append(input)
      // newRow.appendChild(cell)
    } else {
      var input = document.createElement("input")
      input.type = "text"
      cell.append(input)
      // newRow.appendChild(cell)
    }
  }
  //insert new row before the add row button
  // currentTable.insertBefore(newRow, currentTable.lastElementChild)

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
                'Domain and Constraints', 'FK Reference', 'Data Description',
                'Self-Explanatory?']
  //loop to number of cols in a table, create headers for each
  for (var i = 0; i < 8; i++) {
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
  //Construct Add Row Button, build table
  buttonCell.appendChild(newRowBtn)
  buttonRow.appendChild(buttonCell)
  tbody.appendChild(buttonRow)
  newTable.append(tbody)
  //Add new table to the document
  contentDiv = document.getElementById("content")
  contentDiv.appendChild(newTable)

  //Event listener for 'Add Row' button on new table
  newRowBtn.addEventListener("click", idHandler)

  //Add a new row to the new table by default
  newRowBtn.click();
}

function deleteRow() {
  return;
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
  var tables = document.getElementsByTagName('table')
  console.log(tables)
  //tables[1].rows[0].cells[0].firstElementChild.value
}
