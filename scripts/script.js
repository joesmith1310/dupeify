
console.log("Script1 loaded");
const uid = localStorage.getItem('objid');

//JQUERY
$(document).ready(function(){    
    
    $(function(){
        $("#navbar").load("/pages/nav_bar.html")
    });

});

class Product {
	constructor(productID, name, price, brand, type, image) {
        this.productID = productID;
		this.name = name;
		this.price = price;
        this.brand = brand;
        this.type = type;
        this.image = image;
	}
}

class DesignerProduct extends Product {
    constructor(productID, name, price, brand, type, image, matchingProducts, description, featured, popular) {
        super(productID, name, price, brand, type, image);
        this.matchingProducts = matchingProducts;
        this.description = description;
        this.featured = featured;
        this.popular = popular;
	}
}

class User {
    constructor(userID, username) {
        this.userID = userID;
        this.username = username;
    }
}
/* ------------- TEMPORARY FOR FRONT END DEVELOPMENT -------------- */

/* --------- USED TO SIMULATE LOADING DATA FROM DATABASE ---------- */
//[[4, 78, 89, 64, 75, 77]] = [[4 (productID), 78(feature1 match), 89(feature2 match), 64(feature3 match), 75(feature4 match), 77(overall match)]]
const testProduct1 = new DesignerProduct(1, "Test Product 1", 19.99, "/resources/sample-img-1.jpg", [[4, 78, 89, 64, 75, 77]], true, true);
const testProduct2 = new DesignerProduct(2, "Test Product 2", 39.99, "/resources/sample-img-2.jpg", [[5, 80, 74, 78, 91, 81]], true, true);
const testProduct3 = new DesignerProduct(3, "Test Product 3", 49.99, "/resources/sample-img-3.jpg", [[6, 64, 75, 82, 91, 78]], true, true);
const testDupe1 = new Product(4, "Test Product 4", 10.99, "/resources/sample-img-4.jpg");
const testDupe2 = new Product(5, "Test Product 5", 24.99, "/resources/sample-img-5.jpg");
const testDupe3 = new Product(6, "Test Product 6", 32.99, "/resources/sample-img-6.jpg");

//const designerProducts = [testProduct1, testProduct2, testProduct3];
//const dupeProducts = [testDupe1, testDupe2, testDupe3];
let designerProducts = [];
let dupeProducts = [];

const user1 = new User(1, "testUser1");
const user2 = new User(2, "testUser2");
const user3 = new User(3, "testUser3");

const users = [user1, user2, user3];

/* ---------------------------------------------------------------- */

const loadProductsPromise = new Promise (async (resolve, reject) => {
    await getProducts();
    resolve();
});

async function getProducts() {
    return new Promise ((resolve, reject) => {
        const request = new Request('/api/product', {
            method: 'get', 
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request)
        .then(function(res) {
            if (res.status === 200) {
            return res.json() 
        } else {
                alert('Could not get products')
        }                
        })
        .then(async (json) => { 
            let products = json.products;
            await Promise.all(products.map(async (product) => {
                await pushToList(product);
            }));
            resolve();
        }).catch((error) => {
            console.log(error)
        })
    });
}

function pushToList(product) {
    return new Promise ((resolve, reject) => {
        if (!product.designer) {
            const dupe = new Product(product._id, product.name, product.price, product.brand, product.type, `/resources/${product.image}`);
            dupeProducts.push(dupe);
            console.log(`DUPE LOADED: ${dupe}`);
            resolve();
        }
        else {
            let dupeList = []
            const request2 = new Request(`/api/dupes/${product._id}`, {
                method: 'get', 
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
            });
            fetch(request2)
            .then(function(res) {
                if (res.status === 200) {
                    return res.json() 
                } else {
                    alert('Could not get dupes')
                }                
            })
            .then((json) => { 
                let dupes = json;
                for (let i = 0; i < dupes.length; i ++) {
                    let dupe = dupes[i];
                    dupeList.push([dupe.dupeProduct, dupe.cat1, dupe.cat2, dupe.cat3, dupe.cat4, dupe.overall]);
                }
                const prod = new DesignerProduct(product._id, product.name, product.price, product.brand, product.type, `/resources/${product.image}`, dupeList, product.description, product.featured, product.popular);
                designerProducts.push(prod);
                console.log(`PRODUCT LOADED: ${prod}`);
                resolve();
            })
        }
    });
}

function createWindowMessage(text, error=false) {
    let box = document.createElement('div');
    box.classList.add('windowMessage');
    box.innerText = text;
    if (error) {
        box.style.backgroundColor = '#FFCCCC';
    }
    else {
        box.style.backgroundColor = '#BCED91';
    }
    document.body.appendChild(box);
    setTimeout(function(){
        document.body.removeChild(box);
   }, 2000);
}

function createLoader(parent) {
    let loaderBox = document.createElement('div');
    let loader = document.createElement('div');
    loaderBox.classList.add('loaderBox');
    loader.classList.add('loader');
    loaderBox.appendChild(loader);
    parent.appendChild(loaderBox);
    return loaderBox;
}

function makeSuggestion(productType, productBrand, productName, productComment, dupeof=-1) {
    const url = '/api/suggestion';
    const type = productType;
    const brand = productBrand;
    const name = productName;
    const comment = productComment;

    console.log(dupeof);

    let isDes = false;
    if (dupeof == -1) {
        isDes = true;
    }

    let data = {
        userid: uid,
        type: type,
        brand: brand,
        name: name,
        comment: comment,
        isDesigner: isDes,
        dupeof: dupeof,
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
            createWindowMessage('Suggestion made. View admin response in your account page.');
           
        } else {
            createWindowMessage('Error making suggestion');
        }  
        // log the result in the console for development purposes,
        //  users are not expected to see this.
    }).catch((error) => {
        createWindowMessage('Error making suggestion');
    })
}

function buildSuggestion(s, admin) {
    const suggestion = document.createElement('div');
    suggestion.classList.add('suggestion');
    if (s.isDesigner) {
        suggestion.innerHTML = `
        <div class='sTypeCol'>New Product:</div>
        <div class='psInfoColumn'>
            <label>${s.name}</label>
            <label>${s.brand}</label>
            <label>${s.type}</label>
        </div>
        <div class='psUserColumn'>
            <label>${s.comment}</label>
        </div>
        `
        if (admin) {
            suggestion.appendChild(createDecisionColumn(s._id));
        }
    }
    else {
        const request = new Request(`/api/product/${s.dupeof}`, {
            method: 'get', 
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request)
        .then(function(res) {
            if (res.status === 200) {
                return res.json() 
            } else {
                console.log("One or more suggestions could not be loaded.")
            }                
        })
        .then((json) => {
            if (json) {
                p = json[0];

                const suggestionType = document.createElement('div');
                suggestionType.classList.add('sTypeCol');
                suggestionType.innerText = 'New dupe for:'
                suggestion.appendChild(suggestionType);

                const image = document.createElement('img');
                try {
                    image.setAttribute('src', `/resources/${p.image}`);
                } catch(e) {
                    console.log(e);
                    image.setAttribute('src', `/resources/error.jpg`);
                }

                const designerCol = document.createElement('div');
                designerCol.classList.add('dsDesignerCol');
                const designerInfo = document.createElement('div');
                const nameLabel = document.createElement('label');
                const idLabel = document.createElement('label');
                nameLabel.innerText = p.name;
                idLabel.innerText = p._id;
                
                designerCol.appendChild(image);
                designerInfo.appendChild(nameLabel);
                designerInfo.appendChild(idLabel);
                designerCol.appendChild(designerInfo);
                suggestion.appendChild(designerCol);

                const dupeCol = document.createElement('div');
                dupeCol.classList.add('dsDupeCol');
                dupeCol.innerHTML = `
                <label><b>A user suggested:</b></label>
                <label>Name: ${s.name}</label>
                <label>Brand: ${s.brand}</label>
                <label>Type: ${s.type}</label>
                <label>User comment: ${s.comment}</label>`
                suggestion.appendChild(dupeCol);

                const statusCol = document.createElement('div');
                statusCol.classList.add('dsStatusCol');
                if (s.approved == 0) {
                    statusCol.innerText = 'Pending Review'
                }
                if (s.approved == 1) {
                    statusCol.innerText = 'Approved'
                }
                if (s.approved == -1) {
                    statusCol.innerText = 'Rejected'
                }
                suggestion.appendChild(statusCol);
                if (admin) {
                    suggestion.appendChild(createDecisionColumn(s._id));
                }
            }
            else {
                console.log("One or more suggestions could not be loaded.")
            }
        }).catch((e) => {
            console.log(e);
            console.log("One or more suggestions could not be loaded.")
        });
    }
    return suggestion;

}

function createDecisionColumn(sid) {
    const decisionColumn = document.createElement('div');
    decisionColumn.classList.add('sDecisionCol');
    const approveButton = document.createElement('div');
    const rejectButton = document.createElement('div');

    approveButton.innerHTML = '&#x2611;'
    approveButton.style.cssText = `
    background-color: #BCED91;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;`
    rejectButton.innerHTML = '&#x2612;'
    rejectButton.style.cssText = `
    background-color: #FFCCCC;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;`

    approveButton.addEventListener('click', () => {
        resolveSuggestion(sid, 1);
        createSuggestions();
    });
    rejectButton.addEventListener('click', () => {
        resolveSuggestion(sid, -1)
        createSuggestions();
    });
    decisionColumn.appendChild(approveButton);
    decisionColumn.appendChild(rejectButton);
    return(decisionColumn)
}

function resolveSuggestion(sid, dec) {
    const url = '/api/suggestion';

    let data = {
        sid: sid,
        decision: dec,
    }

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
            createWindowMessage('Resolved product suggestion');
           
        } else {
            console.log('ERROR')
            createWindowMessage('Could not resolve suggestion.', true);
     
        }
    }).catch((error) => {
        console.log(error);
        createWindowMessage('Could not resolve suggestion.', true);
    })
}


