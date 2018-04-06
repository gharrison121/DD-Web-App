//JS file for landing Page

//Functions to include here


//run this immediately
(function () {
  getDataDictionaries()
}());

async function getDataDictionaries() {
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  var header = document.getElementById("userName")
  var responseHolder = document.getElementById("yourDictionaries")
  console.log(token)

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

  // handle the response

  const data = await response.json();
  console.log("data dictionaries found: " + data.length)

  //loop through each data dictionary found
  for (var i=0; i < data.length; i++) {
    console.log(data[i].dictionaryID + ", " + data[i].title + ", " + data[i].created)
    var elContainer = document.createElement('p')
    var el = document.createElement('a')
    el.setAttribute('href', '#createdd')
    el.innerHTML = data[i].title + ", " + data[i].created

    //assign the dictionaryID as a property of the element
    el.dictionaryID = data[i].dictionaryID

    //append the element
    elContainer.appendChild(el)
    responseHolder.appendChild(elContainer)

    el.addEventListener("click", function() {
      console.log(this.dictionaryID)
      localStorage.setItem('dictionaryID', this.dictionaryID)
    })

    //FROM HERE ->
    /*
    CREATE LINKS TO THE CREATEDD PAGE FOR EACH OBJECT IN THE ARRAY => done

    add event listeners to each element?
    GRAB DICTIONARY ID OF THE ONE CLICKED AND STORE IT IN LOCAL STORAGE
     */
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

  // if (!response.ok) {
  //   console.log("response is not okay?")
  //   console.log(response.status)
  //   return;
  // } else {
  //   console.log("response is k")
  //   //NOT SURE IF THIS IS THE INSERTED ROW ID, CHECK
  //   const data = response.text()
  //   console.log("the data is: " + data)
  // }




}
