const newProductForm = document.querySelector('#newProductForm');
const addProductButton = document.querySelector('#addProductButton');

addProductButton.addEventListener('click', function(){
    toggleDropdown(newProductForm, addProductButton)});

function toggleDropdown(dropdown, button) {
    console.log("toggle");
    dropdown.classList.toggle('expand');
    button.classList.toggle('opened');
}

function addProduct() {
    alert('New product added!');
}
