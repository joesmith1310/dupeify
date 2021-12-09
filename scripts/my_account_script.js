function myAccountEdit() {  
  var b = document.getElementById("accountButton");
  if(b.innerText=="Edit"){
    document.getElementById("myP").contentEditable = true;
    document.getElementById("demo").innerHTML = "Click on what you want to edit!";
    document.getElementById("myP2").contentEditable = true;
    document.getElementById("myP3").contentEditable = true;
    document.getElementById("myP4").contentEditable = true;
    document.getElementById("myP5").contentEditable = true;
    document.getElementById("myP2").contentEditable = true;
    b.innerText = "Save";
  }
  else if(b.innerText=="Save"){
    document.getElementById("myP").contentEditable = false;
    document.getElementById("demo").innerHTML = "";
    document.getElementById("myP2").contentEditable = false;
    document.getElementById("myP3").contentEditable = false;
    document.getElementById("myP4").contentEditable = false;
    document.getElementById("myP5").contentEditable = false;
    document.getElementById("myP2").contentEditable = false;
    b.innerText = "Edit";

    updateUser();
    }

}

function updateUser() {
  const url = '/api/users/61a7fcdf2924f422f8094475';

  let data = [
    {"op":"replace", "path":"/age", "value":document.getElementById("myP2").innerText},
    {"op":"replace", "path":"/skintype", "value":document.getElementById("myP3").innerText},
    {"op":"replace", "path":"/eyecolor", "value":document.getElementById("myP4").innerText},
    {"op":"replace", "path":"/birthday", "value":document.getElementById("myP5").innerText}
  ]
  
  // let data = [
  //   {"op":"replace", "path":"/username", "value":"Youyi"},
  //   {"op":"replace", "path":"/age", "value":"100"}
  // ]


  const request = new Request(url, {
      method: 'PATCH', 
      body: JSON.stringify(data),
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
  });

  fetch(request)
  .then(function(res) {
      if (res.status === 200) {
          console.log('User updated')
          alert('Successfully updated User');           
      } else {
          console.log('ERROR')
          alert('ERROR');
   
      }
      console.log(res)  // log the result in the console for development purposes,
                        //  users are not expected to see this.
  }).catch((error) => {
      console.log(error)
  })
}
const redHeart = '\u2764';
const whiteHeart = '\u2661';


function favouriteProduct1Toggle() { 
  var b = document.getElementById("favouriteProduct1Button");
  if(b.classList.contains("redColour")) {
    b.classList.remove("redColour");
    //document.getElementById("product1").style.display = "none";
    document.getElementById("favouritediv").style.display = "none";
  }
  else {
    b.classList.add("redColour");
    //document.getElementById("product1").style.display = "inline-block";
    document.getElementById("favouritediv").style.display = "inline-block";

  }
}

  function favouriteProduct2Toggle() {
    var b = document.getElementById("favouriteProduct2Button");
    if(b.classList.contains("redColour")) {
      b.classList.remove("redColour");
      document.getElementById("product2").style.display = "none";
    }
    else {
      b.classList.add("redColour");
      document.getElementById("product2").style.display = "inline-block";
  
    }
  }

  function myReview1Edit() {
    var b = document.getElementById("review1Button");
    if(b.innerText=="Edit"){
      document.getElementById("myR").contentEditable = true;
      document.getElementById("review1Demo").innerHTML = "Click on your review text to edit!";
      b.innerText = "Save";
    }
    else if(b.innerText=="Save"){
      document.getElementById("myP").contentEditable = false;
      document.getElementById("review1Demo").innerHTML = "";
      b.innerText = "Edit";
    }
  }

  function myReview2Edit() { 
    var b = document.getElementById("review2Button");
    
    if(b.innerText=="Edit"){ 
      
      document.getElementById("myR2").contentEditable = true;
      document.getElementById("review2Demo").innerHTML = "Click on your review text to edit!";
      b.innerText = "Save";
    }
    else if(b.innerText=="Save"){
      document.getElementById("myP2").contentEditable = false;
      document.getElementById("review2Demo").innerHTML = "";
      b.innerText = "Edit";
    }
  }

function seeAllFavourite(){
  var b = document.getElementById("favouriteSeeAll");    
  if(b.innerText=="See All"){     
    document.getElementById("favourite2").style.display = "inline";
    b.innerText = "See Less";
  }
  else if(b.innerText=="See Less"){
    document.getElementById("favourite2").style.display = "none";
    b.innerText = "See All";
  }  
}

function seeAllReviews(){
  var b = document.getElementById("reviewSeeAll");    
  if(b.innerText=="See All"){     
    document.getElementById("review2").style.display = "inline";
    b.innerText = "See Less";
  }
  else if(b.innerText=="See Less"){
    document.getElementById("review2").style.display = "none";
    b.innerText = "See All";
  }  
}

function addName(){
  var name = 'Lisa Xin';
  var b = document.getElementById("myP");
  b.innerHTML = name;

}

function addAge(){
  var name = '21';
  var b = document.getElementById("myP2");
  b.innerHTML = name;

}


function AddSkinType(){
  var name = 'Combo';
  var b = document.getElementById("myP3");
  b.innerHTML = name;

}


function addEyeC(){
  var name = 'brown';
  var b = document.getElementById("myP4");
  b.innerHTML = name;

}

function addBirthday(){
  var name = 'Oct 28, 2000';
  var b = document.getElementById("myP5");
  b.innerHTML = name;

}

function addAllInfo(){
  // addName();
  // addAge();
  // AddSkinType();
  // addEyeC();
  // addBirthday();

  fillUserInfo();
}






function myOnLoad(){
  loadMySuggestions();
  /*document.getElementById("submitSuggestion").addEventListener('click', function(){
    var suggestForm = document.getElementById('newProductForm');
    toggleDropdown(suggestForm);    
  });*/
}

function fillUserInfo() {
  const objid = localStorage.getItem("objid");
  const url = '/api/users/' + objid;

  const request = new Request(url, {
    method: 'get', 
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  });

  fetch(request)
    .then(function(res) {
        if (res.status === 200) {
            // return a promise that resolves with the JSON body
           return res.json() 
       } else {
            alert('Could not get user')
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
      document.getElementById("myP").innerHTML = json.username;
      document.getElementById("myP2").innerHTML = json.age;
      document.getElementById("myP3").innerHTML = json.skintype;
      document.getElementById("myP4").innerHTML = json.eyecolor;
      document.getElementById("myP5").innerHTML = json.birthday.substring(0,10);
    }).catch((error) => {
        console.log(error)
    })  
}

function toggleDropdown(dropdown) {
  console.log("toggle");
  dropdown.classList.toggle('expand');
}
  // const like = b.textContent;
  // alert(like);
  // if(like=="&#x2764;&#xfe0f;") {alert("1")
  //   b.textContent = whiteHeart;
  // } else {
  //   b.textContent = redHeart;
  // }

function suggestProd() {
  const form = document.getElementById("suggestProductForm");
  const type = form.productType.value;
  const brand = form.productBrand.value;
  const name = form.productName.value;
  const comment = form.productComment.value;
  makeSuggestion(type, brand, name, comment);
}


function loadMySuggestions() {
  const suggestionsBox = document.getElementById("mySuggestions");
  suggestionsBox.innerHTML = "";
  const request = new Request(`/api/suggestion/${localStorage.getItem('objid')}`, {
      method: 'GET', 
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
  });
  fetch(request)
  .then(function(res) {
      if (res.status === 200) {
          // return a promise that resolves with the JSON body
         return res.json() 
     } else {
          createWindowMessage("Could not get suggestions", true);
     }                
  })
  .then((json) => {  // the resolved promise with the JSON body
      if (json.length == 0) {
          suggestionsBox.innerText = "No suggestions right now."
      }
      else{ 
          json.map((s) => {
              const suggestion = buildSuggestion(s, false);
              suggestionsBox.appendChild(suggestion);
          });
      }
  })
  .catch((error) => {
      console.log(error)
  })
}

