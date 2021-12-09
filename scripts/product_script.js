const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("productid");
console.log(productId);

let product = null;
let matches = [];
let dupes = [];

const productPage = document.querySelector(".product_page");
const dupesList = document.getElementById("dupes_list");
productPage.style.display = "none";
let loader = createLoader(document.body);

loadProduct()
    .then(() => {
        return loadMatches();
    })
    .then(() => {
        return loadDupes();
    })
    .catch(() => {
        console.log("ERROR");
    })
    .then(() => {
        document.body.removeChild(loader);
        productPage.style.display = "block";
        loadPage();
    });

function loadProduct() {
    return new Promise((resolve, reject) => {
        const request = new Request(`/api/product/${productId}`, {
            method: "get",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
        });
        fetch(request)
            .then(function (res) {
                if (res.status === 200) {
                    return res.json();
                } else {
                    createWindowMessage("Error: could not find product", true);
                    reject();
                }
            })
            .then((json) => {
                if (json) {
                    p = json[0];
                    product = new DesignerProduct(
                        p._id,
                        p.name,
                        p.price,
                        p.brand,
                        p.type,
                        p.image,
                        [],
                        p.description,
                        p.featured,
                        p.popular
                    );
                    resolve();
                }
            })
            .catch(() => {
                reject();
            });
    });
}

function loadMatches() {
    return new Promise((resolve, reject) => {
        const request = new Request(`/api/dupes/${productId}`, {
            method: "get",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
        });
        fetch(request)
            .then(function (res) {
                if (res.status === 200) {
                    return res.json();
                } else {
                    createWindowMessage("Error: could not find dupes", true);
                    reject();
                }
            })
            .then((json) => {
                if (json) {
                    ms = json;
                    ms.map((m) => {
                        let match = [
                            m.dupeProduct,
                            m.cat1,
                            m.cat2,
                            m.cat3,
                            m.cat4,
                            m.overall,
                        ];
                        matches.push(match);
                    });
                    resolve();
                }
            })
            .catch(() => {
                reject();
            });
    });
}

function loadDupes() {
    return Promise.all(
        matches.map((m) => {
            return new Promise((resolve) => {
                const request = new Request(`/api/product/${m[0]}`, {
                    method: "get",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                    },
                });
                fetch(request)
                    .then(function (res) {
                        if (res.status === 200) {
                            return res.json();
                        } else {
                            createWindowMessage(
                                "Error: could not find dupe",
                                true
                            );
                        }
                    })
                    .then((json) => {
                        if (json) {
                            p = json[0];
                            let dupe = new Product(
                                p._id,
                                p.name,
                                p.price,
                                p.brand,
                                p.type,
                                p.image
                            );
                            dupes.push(dupe);
                            resolve();
                        }
                    })
                    .catch(() => {
                        resolve();
                    });
            });
        })
    );
}

function loadPage() {
    createProduct();
    createDupes();
}

function createProduct() {
    const productDiv = document.getElementById("product");
    productDiv.innerHTML = `
    <div class="product_image">
        <img src="/resources/${product.image}" alt="Product Image">
    </div>
    <div class="product_info">
        <h3 id="product_title">${product.name}</h3>
        <h2 id="product_price">$${product.price}</h2>
        <p id="product_description">${product.description}</p>
    </div>
    `;
    $("#like-container").detach().appendTo(".product_info");
}

function createDupes() {
    dupes.map((d) => {
        data = [d, getMatchStats(d)];
        let sc = createSmallComparison(data);
        dupesList.appendChild(sc);
    });
    if (dupes.length == 0) {
        dupesList.innerHTML = "<br>This product doesn't have any dupes";
    }
}

function createSmallComparison(data) {
    let dupe = data[0];
    let stats = data[1];
    const smallComparison = document.createElement("div");
    smallComparison.classList.add("comparisonSmall");
    smallComparison.innerHTML = `
    <div class = "cSImgBox">
        <img src="/resources/${dupe.image}">
    </div>
    <ul class="cSInfo">
        <h4>${dupe.name}</h4>
        <li>
            <p>Color</p>
            <div class="cSPercentageBar">
                <div style="width:${stats[1]}%;"></div>
            </div>
            <p>${stats[1]}%</p>
        </li>
        <li>
            <p>Texture</p>
            <div class="cSPercentageBar">
                <div style="width:${stats[2]}%;"></div>
            </div>
            <p>${stats[2]}%</p>
        </li>
        <li>
            <p>Ingredients</p>
            <div class="cSPercentageBar">
                <div style="width:${stats[3]}%;"></div>
            </div>
            <p>${stats[3]}%</p>
        </li>
        <li>
            <p>Longevity</p>
            <div class="cSPercentageBar">
                <div style="width:${stats[4]}%;"></div>
            </div>
            <p>${stats[4]}%</p>
        </li>
    </ul>
    <p class="cSOverall">${stats[5]}%</p>
    <p class="cSPrice">$${dupe.price}</p>
    `;
    return smallComparison;
}

function getMatchStats(dupe) {
    let dupeId = dupe.productID;
    for (let i = 0; i < matches.length; i++) {
        if (matches[i][0] == dupeId) {
            return matches[i];
        }
    }
}

function sortByPrice(desc = false) {
    let prices = [];
    dupes.map((d) => {
        if (!prices.includes(d.price)) {
            prices.push(d.price);
        }
    });
    prices.sort(numSort);
    if (desc) {
        prices.reverse();
    }
    let newDupes = [];
    prices.map((p) => {
        dupes.map((d) => {
            if (d.price == p) {
                newDupes.push(d);
            }
        });
    });
    dupes = newDupes;
    reloadDupes();
}

function sortByMatch() {
    let matchPercentages = [];
    matches.map((m) => {
        if (!matchPercentages.includes(m[5])) {
            matchPercentages.push(m[5]);
        }
    });
    matchPercentages.sort(numSort);
    matchPercentages.reverse();
    let newDupes = [];
    matchPercentages.map((m) => {
        dupes.map((d) => {
            let stats = getMatchStats(d);
            if (stats[5] == m) {
                newDupes.push(d);
            }
        });
    });
    dupes = newDupes;
    reloadDupes();
}

function reloadDupes() {
    dupesList.innerHTML = "";
    createDupes();
}

function suggest() {
    const form = document.getElementById("suggestDupeForm");
    const type = form.productType.value;
    const brand = form.productBrand.value;
    const name = form.productName.value;
    const comment = form.productComment.value;
    makeSuggestion(type, brand, name, comment, productId);
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

$.ajax({
    url: "/api/get-like",
    data: JSON.stringify({
        user: localStorage.getItem("objid"),
        product: productId,
    }),
    dataType: "json",
    type: "POST",
    contentType: "application/json",
    success: (response) => {
        if (response.like) {
            $("#like-button").addClass("selected");
        } else {
            $("#dislike-button").addClass("selected");
        }
    },
    error: (e) => console.log(e),
});

function getLikePercentage() {
    $.ajax({
        url: "/api/get-like-percentage",
        data: JSON.stringify({
            product: productId,
        }),
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        success: (response) => {
            if (response.percentage !== null) {
                let p = document.getElementById("like-percentage");
                if (p === null) {
                    p = document.createElement("p");
                    p.id = "like-percentage";
                    $("#like-container").append(p);
                }
                p.innerHTML = Math.round(response.percentage * 100) + "%";
            }
        },
        error: (e) => console.log(e),
    });
}

getLikePercentage();

$("#like-button").click(function () {
    $("#like-button").addClass("selected");
    $("#dislike-button").removeClass("selected");
    $.ajax({
        url: "/api/like",
        data: JSON.stringify({
            user: localStorage.getItem("objid"),
            product: productId,
            like: true,
        }),
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        success: (response) => getLikePercentage(),
        error: (e) => console.log(e),
    });
});

$("#dislike-button").click(function () {
    $("#dislike-button").addClass("selected");
    $("#like-button").removeClass("selected");
    $.ajax({
        url: "/api/like",
        data: JSON.stringify({
            user: localStorage.getItem("objid"),
            product: productId,
            like: false,
        }),
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        success: (response) => getLikePercentage(),
        error: (e) => console.log(e),
    });
});
