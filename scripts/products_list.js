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
        <div>
            <h2>${product.name}</h2>
            <h3>${product.price}</h3>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Morbi nec velit sem. Sed vel urna ultricies, fermentum lacus
            ac, semper tellus. Vivamus molestie ut leo ut dignissim.
            Integer et ullamcorper urna, vel porttitor tortor. Donec
            venenatis nec elit a luctus. Proin egestas accumsan orci sit
            amet elementum. Nulla quis placerat erat, at auctor tellus.
            Integer nec eleifend diam, eget blandit eros. Praesent ante
            leo, semper id magna a, sagittis pharetra turpis. Aliquam at
            velit sem. Vivamus ultrices auctor euismod. Fusce tincidunt,
            dolor sed ullamcorper maximus, tortor nunc varius odio, id
            mattis sapien leo quis neque. Nulla facilisi.
            <br />
            <br />
            ${
                product instanceof DesignerProduct
                    ? `Dupes: ${product.matchingProducts.length}
            <br />
            <button>View Dupes</button>`
                    : ``
            }
        </div>
    `;
});
