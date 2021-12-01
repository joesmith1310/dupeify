console.log("products_list.js loaded");

const parent = document.getElementById("product_list");
let title = "All Products";
let products = designerProducts.concat(dupeProducts);
if (sessionStorage.getItem("products")) {
    if (sessionStorage.getItem("products") === "featured") {
        products = designerProducts.filter((e) => e.featured);
        title = "Featured Products";
    } else if (sessionStorage.getItem("products") === "popular") {
        products = designerProducts.filter((e) => e.popular);
        title = "Popular Products";
    } else if (sessionStorage.getItem("products") === "search") {
        products = products.filter((e) =>
            e.name
                .toLowerCase()
                .includes(sessionStorage.getItem("search").toLowerCase().trim())
        );
        title = "Search Results";
    }
}
document.getElementById("title").innerHTML = title;
products.forEach((product) => {
    const div = document.createElement("div");
    div.className = "product_entry";
    parent.appendChild(div);

    // const imageDiv = document.createElement("div");
    // div.className = "product_image";
    // div.appendChild(imageDiv);

    // const image = document.createElement("img");
    // image.setAttribute("src", ".." + product.image);
    // imageDiv.appendChild(image);

    // const descriptionDiv = document.createElement("div");
    // div.appendChild(descriptionDiv);

    // const

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

    div.onclick = () => (window.location.href = "/pages/product_page.html");

    // ${
    //     product instanceof DesignerProduct
    //         ? `Dupes: ${product.matchingProducts.length}
    // <br />
    // <button>View Dupes</button>`
    //         : ``
    // }
});
