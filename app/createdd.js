console.log("Create DD Page")

//ID Getters
// var addrow = document.getElementById("addrow")
// var ddtable = document.getElementById("datadictionary")
//Event Listeners
// addrow.addEventListener("click", addRow)

//Handles which add row button has been clicked
function idHandler() {
  addRow(event.srcElement.id)
}

function addRow(id) {
  console.log("addrow function")
  var rowBtn = document.getElementById(id)
  currentTable = rowBtn.closest("tbody")
  var newRow = document.createElement("tr")
  //Loop through each column in the table and create cell
  for (var i=0; i < 8; i++) {
    var cell = document.createElement("td")

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
        newRow.appendChild(cell)
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
        newRow.appendChild(cell)
      }
    } else if (i == 7) {
      var input = document.createElement("input")
      input.type = "checkbox"
      cell.append(input)
      newRow.appendChild(cell)
    } else {
      var input = document.createElement("input")
      input.type = "text"
      cell.append(input)
      newRow.appendChild(cell)
    }
  }
  //insert new row before the add row button
  currentTable.insertBefore(newRow, currentTable.lastElementChild)

}

function addTable() {
  console.log("addtable run")
  var newTable = document.createElement("table"),
      tbody = document.createElement("tbody"),
      tableNameRow = document.createElement("tr")
      tableName = document.createElement("th")
      tableName.colSpan = 2
      tableName.innerHTML = "Table Name "

      tableNameInput = document.createElement("input")
      tableNameInput.type = "text"

      //Construct HTML element
      tableNameRow.appendChild(tableName)
      tableName.appendChild(tableNameInput)
      tbody.appendChild(tableNameRow)

      headersRow = document.createElement("tr")
      headers = ['Attribute Name', 'Key', 'Data Type', 'Data Size',
                'Domain and Constraints', 'FK Reference', 'Data Description',
                'Self-Explanatory?']
  //loop to number of cols in a table, create headers for each
  for (var i = 0; i < 8; i++) {
    var rowHeader = document.createElement("th")
    rowHeader.innerHTML = headers[i]
    headersRow.appendChild(rowHeader)
  }

  tbody.appendChild(headersRow)
  newTable.appendChild(tbody)
  document.body.appendChild(newTable)

}
