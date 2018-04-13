//JS file for landing Page

//run this immediately

(function () {
  getDataDictionaries()
}());

async function getDataDictionaries() {
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  var header = document.getElementById("userName")
  var responseHolder = document.getElementById("yourDictionaries")
  responseHolder.innerHTML = "" //for when called again

  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token },
  };
  const response = await fetch('/dataDictionary/myDictionaries', fetchOptions);
  if (!response.ok) {
    console.log("response not okay?")
    console.log(response.status)
    return;
  }


  const data = await response.text();
  if (data) {

    if (data != "No dictionaries found matching your userID") {
      var parsedData = JSON.parse(data)
      //loop through each data dictionary found
      for (var i=0; i < parsedData.length; i++) {
        console.log(parsedData[i].dictionaryID + ", " + parsedData[i].title + ", " + parsedData[i].created)
        var elContainer = document.createElement('div')
        var el = document.createElement('a')
        el.setAttribute('href', '#createdd')
        el.innerHTML = parsedData[i].title
        var createdDate = document.createElement('p')
        createdDate.innerHTML = "created at : " + parsedData[i].created

        //assign the dictionaryID as a property of the element
        el.dictionaryID = parsedData[i].dictionaryID

        //remove dictionary button
        var removeBtn = document.createElement('button')
        removeBtn.innerHTML = 'Delete'
        removeBtn.addEventListener("click", removeDictionary)


        //append the dictionary link
        elContainer.appendChild(el)
        elContainer.appendChild(createdDate)
        elContainer.appendChild(removeBtn)

        responseHolder.appendChild(elContainer)

        el.addEventListener("click", function() {
          localStorage.setItem('dictionaryID', this.dictionaryID)
        })
      }

    } else {
      document.getElementById("yourDictionaries").innerHTML = "You currently have no created data dictionaries, click the button below to start"
    }

  }

}

function addDictionary(e) {
  e.preventDefault()
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  var newDD = {}
  newDD.title = document.getElementById("dictionaryName").value

  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    body: JSON.stringify(newDD),
    headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
  };

  fetch('/dataDictionary/addDictionary', fetchOptions)

  //update data dictionaries shown on the page
  getDataDictionaries()

}

function revealForm() {
  var form = document.getElementById("dictionaryForm");
  if (form.style.display === "none") {
      form.style.display = "block";
  } else {
      form.style.display = "none";
  }
}

function removeDictionary(e) {
  //closest 'a' wouldn't work
  var dictionaryClicked = []
  dictionaryClicked.push(e.target.closest('div').firstChild.dictionaryID)

  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    body: JSON.stringify(dictionaryClicked),
    headers: new Headers({
        'Content-Type': 'application/json'
      })
  };

  fetch('/dataDictionary/removeDictionary', fetchOptions)

  getDataDictionaries()

}
