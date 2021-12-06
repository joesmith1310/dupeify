const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('productid')
console.log(productId);

let product = null;
let matches = [];
let dupes = [];

loadProduct()
.then(() => {
    return loadMatches();
})
.then(() => {
    return loadDupes();
})
.then(() => {
    loadPage();
})
.catch((e) => {
    console.log(e);
});

function loadProduct() {
    return new Promise((resolve, reject) => {
        const request = new Request(`/api/product/${productId}`, {
            method: 'get', 
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request)
        .then(function(res) {
            if (res.status === 200) {
                createWindowMessage("Product Found", false);
                return res.json() 
           } else {
                createWindowMessage("Error: could not find product", true);
                reject();
           }                
        })
        .then((json) => {
            if (json) {
                p = json[0];
                product = new DesignerProduct(p._id, p.name, p.price, p.brand, p.type, p.image, [], p.description, p.featured, p.popular);
                resolve();
            }
        }).catch((error) => {
            console.log(error);
            reject();
        });
    });
}

function loadMatches() {
    return new Promise((resolve, reject) => {
        const request = new Request(`/api/dupes/${productId}`, {
            method: 'get', 
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request)
        .then(function(res) {
            if (res.status === 200) {
                createWindowMessage("Product Found", false);
                return res.json() 
           } else {
                createWindowMessage("Error: could not find dupes", true);
                reject();
           }                
        })
        .then((json) => {
            if (json) {
                ms = json;
                ms.map((m) => {
                    let match = [m.dupeProduct, m.cat1, m.cat2, m.cat3, m.cat4, m.overall]
                    matches.push(match);
                });
                resolve();
            }
        }).catch((error) => {
            console.log(error);
            reject();
        });
    });
}

function loadDupes() {
    return Promise.all(matches.map((m) => {
        return new Promise((resolve) => {
            const request = new Request(`/api/product/${productId}`, {
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
                    createWindowMessage("Error: could not find dupe", true);
               }                
            })
            .then((json) => {
                if (json) {
                    p = json[0];
                    dupe = new Product(p._id, p.name, p.price, p.brand, p.type, p.image);
                    console.log(dupe);
                    dupes.push(dupe);
                    resolve();
                }
            }).catch((error) => {
                console.log(error);
            });
        });
    }));
}

function loadPage() {
    console.log(product);
    console.log(matches);
    console.log(dupes);
}

/*product = designerProducts[0];

let dupes = dupeProducts;

function createDupes() {
    const dupesList = document.querySelector("#dupes_list");
    for (let i = 0; i < dupes.length; i++) {
        const comparisonSmall = document.createElement("div");
        comparisonSmall.classList.add("comparisonSmall");
        const cSImgBox = document.createElement("div");
        cSImgBox.classList.add("cSImgBox");
        const cSImg = document.createElement("img");
        cSImg.setAttribute("src", )

        const cSInfo = document.createElement("ul");
        cSInfo.classList.add("cSInfo");
        const productTitle = document.createElement("h4");
        productTitle.innerText = product.name;
        cSInfo.appendChild(productTitle);

        for (let i = 1; i < product.matchingProducts[0].length - 1; i++) {
            const li1 = document.createElement("li");
            const cat1 = document.createElement("p");
            cat1.innerText = "Attribute 1";
            const percentageBar = document.createElement("div");
            percentageBar.classList.add("cSPercentageBar");
            const percentageFill = document.createElement("div");
            percentageFill.style.width = `${product.matchingProducts[0][i]}%`;
            const percentage = document.createElement("p");
            percentage.innerText = `${product.matchingProducts[0][i]}%`;
            cSInfo.appendChild(li1);
            li1.appendChild(cat1);
            li1.appendChild(percentageBar);
            li1.appendChild(percentage);
            percentageBar.appendChild(percentageFill);
        }
    }
}*/