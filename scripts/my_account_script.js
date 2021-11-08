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
    
  }
}
  

const redHeart = '\u2764';
const whiteHeart = '\u2661';


function favouriteProduct1Toggle() { 
  var b = document.getElementById("favouriteProduct1Button");
  if(b.classList.contains("redColour")) {
    b.classList.remove("redColour");
    document.getElementById("product1").style.display = "none";
  }
  else {
    b.classList.add("redColour");
    document.getElementById("product1").style.display = "inline-block";

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
  // const like = b.textContent;
  // alert(like);
  // if(like=="&#x2764;&#xfe0f;") {alert("1")
  //   b.textContent = whiteHeart;
  // } else {
  //   b.textContent = redHeart;
  // }

