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

  // get partial page from server
  xhr.open("GET", pageID); //+ ".html");
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
  location.hash = "#landing";
}

//------------------Login---------------------
console.log("login js ")

var oauth = document.createElement("script")
oauth.src = 'https://apis.google.com/js/platform.js?onload=init'
document.body.appendChild(oauth);


function init() {
  console.log('google auth package loaded')
  gapi.load('auth2', function() {
    gapi.signin2.render("loginDiv", {
    "scope": "profile email openid",
    "width": 200,
    "height": 40,
    "longtitle": true,
    "theme": "dark",
    "onsuccess": onSignIn
    });

  });
}

function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();

  callServer();
}
async function signOut() {
  await gapi.auth2.getAuthInstance().signOut();
  console.log('User signed out.');
}

async function callServer() {
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  // const el = document.getElementById('server-response');
  // el.textContent = 'loading…';

  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token },
  };
  const response = await fetch('/api/hello', fetchOptions);
  if (!response.ok) {
    console.log(response.status)
    // handle the error
    // el.textContent = "Server error:\n" + response.status;
    return;
  }

  // handle the response
  const data = await response.text();
  console.log('the data is: ' + data);
  // el.textContent = data;
}

// react to computer sleeps, get a new token; gapi doesn't do this reliably
// adapted from http://stackoverflow.com/questions/4079115/can-any-desktop-browsers-detect-when-the-computer-resumes-from-sleep/4080174#4080174
(function () {
  const CHECK_DELAY = 2000;
  let lastTime = Date.now();

  setInterval(() => {
    const currentTime = Date.now();
    if (currentTime > (lastTime + CHECK_DELAY*2)) {  // ignore small delays
      gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
    }
    lastTime = currentTime;
  }, CHECK_DELAY);
}());

navigate();
window.addEventListener("hashchange", navigate)
