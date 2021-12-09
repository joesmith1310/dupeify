const content = document.getElementById("productsContent");
content.style.display = "none";
const loader = createLoader(document.body);

window.onload = async function () {
    await loadProductsPromise;
    console.log("LOADING PRODUCTS PAGE");
    init();
    document.body.removeChild(loader);
    content.style.display = "initial";
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const productList = document.getElementById("product_list");

let products = [];

function init() {
    products = designerProducts;
    if (urlParams.get("featured")) {
        filterByFeatured();
    } else if (urlParams.get("popular")) {
        filterByPopular();
    } else if (urlParams.get("search")) {
        let key = urlParams.get("search");
        productSearch(key);
    } else {
        showAll();
    }
}

function filterBySearch() {
    const form = document.getElementById("searchBar");
    let key = form.search.value;
    productSearch(key);
}

function productSearch(key) {
    k = key.toUpperCase();
    products = designerProducts;
    results = [];
    products.map((p) => {
        const name = p.name.toUpperCase();
        const brand = p.brand.toUpperCase();
        const type = p.type.toUpperCase();
        console.log(name);
        if (name.includes(k) || k.includes(name)) {
            results.push(p);
        } else if (brand.includes(k) || k.includes(brand)) {
            results.push(p);
        } else if (type.includes(k) || k.includes(type)) {
            results.push(p);
        }
    });
    products = results;
    productList.innerHTML = `<h3 id="title">Search results for "${key}"</h3>`;
    loadProducts(products);
}

function sortByPrice(desc = false) {
    let prices = [];
    products.map((p) => {
        if (!prices.includes(p.price)) {
            prices.push(p.price);
        }
    });
    console.log(prices);
    prices.sort(numSort);
    if (desc) {
        prices.reverse();
    }
    let newProducts = [];
    prices.map((pr) => {
        products.map((p) => {
            if (p.price == pr) {
                newProducts.push(p);
            }
        });
    });
    products = newProducts;
    let currTitle = productList.children[0].innerText;
    productList.innerHTML = `<h3>${currTitle}</h3>`;
    loadProducts(products);
}

function sortByName(desc = false) {
    let names = [];
    products.map((p) => {
        if (!names.includes(p.name)) {
            names.push(p.name);
        }
    });
    names.sort();
    if (desc) {
        names.reverse();
    }
    let newProducts = [];
    names.map((n) => {
        products.map((p) => {
            if (p.name == n) {
                newProducts.push(p);
            }
        });
    });
    products = newProducts;
    let currTitle = productList.children[0].innerText;
    productList.innerHTML = `<h3>${currTitle}</h3>`;
    loadProducts(products);
}

function filterByType(type) {
    products = designerProducts;
    let newProducts = [];
    products.map((p) => {
        if (p.type == type) {
            newProducts.push(p);
        }
    });
    products = newProducts;
    productList.innerHTML = `<h3 id="title">${type}</h3>`;
    loadProducts(products);
}

function showAll() {
    productList.innerHTML = `<h3 id="title">All Products</h3>`;
    products = designerProducts;
    loadProducts(products);
}

function filterByPopular() {
    products = designerProducts;
    let newProducts = [];
    products.map((p) => {
        if (p.popular) {
            newProducts.push(p);
        }
    });
    products = newProducts;
    productList.innerHTML = `<h3 id="title">Popular</h3>`;
    loadProducts(products);
}

function filterByFeatured() {
    products = designerProducts;
    let newProducts = [];
    products.map((p) => {
        if (p.featured) {
            newProducts.push(p);
        }
    });
    products = newProducts;
    productList.innerHTML = `<h3 id="title">Featured</h3>`;
    loadProducts(products);
}

function loadProducts(ps) {
    if (ps.length == 0) {
        let msg = document.createElement("div");
        msg.innerText = "No products found";
        productList.appendChild(msg);
    }
    ps.forEach((product) => {
        const div = document.createElement("div");
        div.className = "product_entry";
        productList.appendChild(div);

        div.innerHTML = `
            <div class="product_image">
                <img src="..${product.image}" />
            </div>
            <div class="product_info">
                <h4>${product.name}</h2>
                <h4>$${product.price}</h3>
                <div class="like-container">
                    <button class="like-button button">👍</button>
                    <button class="dislike-button button">👎</button>
                </div>
            </div>
        `;

        if (localStorage.getItem("objid") === null) {
            $(div).find(".like-container").css("display", "none");
        } else {
            $.ajax({
                url: "/api/get-like",
                data: JSON.stringify({
                    user: localStorage.getItem("objid"),
                    product: product.productID,
                }),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                success: (response) => {
                    if (response.like) {
                        $(div).find(".like-button").addClass("selected");
                    } else {
                        $(div).find(".dislike-button").addClass("selected");
                    }
                },
                error: (e) => console.log(e),
            });

            $(div)
                .find(".like-button")
                .click(function (event) {
                    $(div).find(".like-button").addClass("selected");
                    $(div).find(".dislike-button").removeClass("selected");
                    $.ajax({
                        url: "/api/like",
                        data: JSON.stringify({
                            user: localStorage.getItem("objid"),
                            product: product.productID,
                            like: true,
                        }),
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        // success: (response) => getLikePercentage(),
                        error: (e) => console.log(e),
                    });
                    event.stopPropagation();
                });

            $(div)
                .find(".dislike-button")
                .click(function (event) {
                    $(div).find(".dislike-button").addClass("selected");
                    $(div).find(".like-button").removeClass("selected");
                    $.ajax({
                        url: "/api/like",
                        data: JSON.stringify({
                            user: localStorage.getItem("objid"),
                            product: product.productID,
                            like: false,
                        }),
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        // success: (response) => getLikePercentage(),
                        error: (e) => console.log(e),
                    });
                    event.stopPropagation();
                });
        }

        div.onclick = () => {
            window.location.href = `/pages/product_page.html?productid=${product.productID}`;
        };
    });
}
