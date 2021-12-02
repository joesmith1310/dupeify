const expandables = document.getElementsByClassName('expandable');

for (let i = 0; i < expandables.length; i++) {
    expandables[i].previousElementSibling.addEventListener('click', function(){
        toggleDropdown(expandables[i]);
    });
}

function toggleDropdown(dropdown) {
    console.log("toggle");
    dropdown.classList.toggle('expand');
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

function addDupe() {

    const form = document.getElementById('linkDupeForm');
    const cat1 = parseInt(form.colorMatch.value);
    const cat2 = parseInt(form.textureMatch.value);
    const cat3 = parseInt(form.ingredientsMatch.value);
    const cat4 = parseInt(form.longevityMatch.value);
    const overall = parseInt((cat1 + cat2 + cat3 + cat4) / 4);
    const designerProduct = form.designerProduct.value;
    const dupeProduct = form.dupeProduct.value;

    const url = '/api/link';

    let data = {
        cat1: cat1,
        cat2: cat2,
        cat3: cat3,
        cat4: cat4,
        overall: overall,
        designerProduct: designerProduct,
        dupeProduct: dupeProduct,
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
            console.log('Linked products')
            alert('Successfully linked products');
           
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

async function getCodes(search) {
    const request = new Request(`/api/search/${search}`, {
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
            alert('Could not get students')
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        let matches = json.searchResults;
        clearSearchResults();
        let resultsBox = document.getElementById('searchResults');
        for (let i = 0; i < matches.length; i++) {
            resultsBox.appendChild(createSearchResult(matches[i]));
        }
    }).catch((error) => {
        console.log(error)
    })
}

function clearSearchResults() {
    let resultsBox = document.getElementById('searchResults');
    resultsBox.innerHTML = "";
}

function createSearchResult(product) {
    let info = document.createElement('div');
    info.classList.add('resultEntry');
    let type = document.createElement('label');
    if (product.designer) {
        type.innerText = 'Designer';
    }
    else {
        type.innerText = 'Dupe';
    }
    let name = document.createElement('label');
    name.innerText = product.name;
    let brand = document.createElement('label');
    brand.innerText = product.brand;
    let category = document.createElement('label');
    category.innerText = product.type;
    let code = document.createElement('label');
    code.innerText = product._id;
    info.appendChild(type);
    info.appendChild(name);
    info.appendChild(brand);
    info.appendChild(category);
    info.appendChild(code);
    return info;
}

function toggleDupes() {
    const dupesField = document.querySelector('#dupesField');
    dupesField.classList.toggle('expand');
}
