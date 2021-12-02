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
    const url = '/api/product';

    const form = document.getElementById('addProductForm');
    const name = form.productName;
    const price = form.productPrice;
    const brand = form.productBrand;
    const type = form.productType;
    const description = form.productDescription;
    const image = form.productImage;

    let data = {
        name: name.value,
        price: price.value,
        brand: brand.value,
        type: type.value,
        description: description.value,
        image: image.value,
        designer: true,
    }

    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request)
    .then(function(res) {

        if (res.status === 200) {
            console.log('Added product')
            alert('Successfully added product');
           
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

function toggleDupes() {
    const dupesField = document.querySelector('#dupesField');
    dupesField.classList.toggle('expand');
}
