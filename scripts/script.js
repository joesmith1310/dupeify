
console.log("Script1 loaded");


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
    await loadProducts();
    resolve();
});

async function loadProducts() {
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
            dupeProducts.push(new Product(product._id, product.name, product.price, product.brand, product.type, `/resources/${product.image}`));
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
                designerProducts.push(new DesignerProduct(product._id, product.name, product.price, product.brand, product.type, `/resources/${product.image}`, dupeList, product.description, product.featured, product.popular));
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

