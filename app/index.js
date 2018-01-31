console.log("index page")
/*
  Dynamic Content Code for Single Page
*/
// Grabs the content
function getContent(pageID, callback) {

  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    callback(xhr.responseText);
  };

  //This may require folder name for when views are moved into view folder
  xhr.open("GET", pageID + ".html");
  xhr.send(null);
}

// Updates dynamic content based on the fragment identifier.
function navigate() {
  var contentDiv = document.getElementById("content")

  // Remove hash
  pageID = location.hash.substr(1);

  // Set the "content" div innerHTML based on the fragment identifier.
  getContent(pageID, function (content) {
    contentDiv.innerHTML = content;
	
	//dynamically load JS file 
	jsFile = document.createElement("script")
	jsFile.type = 'application/javascript'
	jsFile.src = pageID + ".js"
	document.body.appendChild(jsFile);
  });

}

// Default page is index
if(!location.hash) {
  location.hash = "#login";
}

navigate();
window.addEventListener("hashchange", navigate)
