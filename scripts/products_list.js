window.onload = async function () {
    await loadProductsPromise;
    console.log("LOADING PRODUCTS PAGE")
    init();
};

const productList = document.getElementById("product_list");

let products = []

function init() {
    products = designerProducts;
    loadProducts(products);
}

function productSearch() {
    const form = document.getElementById('searchBar');
    const key = form.search.value;
    key.toUpperCase()
    products = designerProducts;
    results = []
    products.map((p) => {
        const name = p.name.toUpperCase();
        const brand = p.brand.toUpperCase();
        const type = p.type.toUpperCase();
        if (name.includes(key) || key.includes(name)) {
            results.push(p);
        }
        else if (brand.includes(key) || key.includes(brand)) {
            results.push(p);
        }
        else if (type.includes(key) || key.includes(type)) {
            results.push(p);
        }
    });
    products = results;
    productList.innerHTML = '';
    loadProducts();
}

function loadProducts(products) {
    let title = "All Products";
    document.getElementById("title").innerHTML = title;
    products.forEach((product) => {
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
                <div class="button favouriteButton">&hearts;</div>
            </div>
        `;

        div.onclick = () => (window.location.href = `/pages/product_page.html?productid=${product.productID}`);

    });
}

