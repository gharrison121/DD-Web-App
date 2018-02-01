console.log("Create DD Page")

//ID Getters
var addrow = document.getElementById("addrow")
var ddtable = document.getElementById("datadictionary")
//Event Listeners
addrow.addEventListener("click", addRow)

function addRow() {
  console.log("addrow function")
  var newRow = document.createElement("tr")
  //Loop through each column in the table
  for (var i=0; i < 8; i++) {
    console.log(i)
    var cell = document.createElement("td")

    //Columns have different input types
    if (i == 1) {
      console.log("if statement true")
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
  console.log("end of function")
  ddtable.append(newRow)
}
