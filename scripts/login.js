function validateLogin() {
    console.log("OK");
    let uname = document.forms["loginForm"]["uname"].value;
    let psw = document.forms["loginForm"]["uname"].value;
    
    if (uname == 'user' && psw == 'user') {
        alert("Logged in as user!");
        window.localStorage.setItem('role', 'user');
        window.location.href = "/index.html";
        return true;
    }
    else if (uname == 'admin' && psw == 'admin') {
        alert("Logged in as admin!");
        window.localStorage.setItem('role', 'admin');
        window.location.href = "/index.html";
        return true;
    }
    else {
        alert("Username and password not recognised.");
    }
    return false;
  }