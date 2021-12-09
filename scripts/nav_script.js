let role = null

const nav = document.querySelector('#header');
const logoutButton = document.querySelector('#logoutButton');
logoutButton.addEventListener('click', logout);

nav.onload = initialiseNav();

function initialiseNav() {
    updateRole();
    updateControls();
}

function updateRole() {
    if (window.localStorage.getItem('role') == 'admin') {
        role = 'admin';
    }
    else if (window.localStorage.getItem('role') == 'user') {
        role = 'user'
    }
    else {
        role = 'unknown';
    }    
}

function updateControls() {
    const controlButton = document.querySelector('#controlButton');
    if (role == 'user') {
        controlButton.setAttribute('href', '/pages/my_account.html');
        controlButton.innerText = 'My Account';
        logoutButton.classList.remove('hide');
    }
    else if (role == 'admin') {
        controlButton.setAttribute('href', '/pages/admin.html');
        controlButton.innerText = 'Admin Centre';
        logoutButton.classList.remove('hide');
    }
    else {
        controlButton.setAttribute('href', '/pages/login.html');
        controlButton.innerText = 'Log In';
        logoutButton.classList.add('hide');
    }
}

function logout() {
    window.localStorage.clear();
    window.location.href = "/index.html";
}



