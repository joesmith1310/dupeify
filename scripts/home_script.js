window.onload = function () {
    loadProducts();
};

const searchBar = document.querySelector("#searchBar");
searchBar.addEventListener("submit", search);

function search(e) {
    e.preventDefault();
    console.log("OK");
    sessionStorage.setItem("products", "search");
    sessionStorage.setItem(
        "search",
        document.getElementById("searchInput").value
    );
    window.location.href = "/pages/products.html";
}

let featuredProducts = [];
let popularProducts = [];

function getFeaturedProducts() {
    featuredProducts = designerProducts.filter((f) => f.featured);
}

function getPopularProducts() {
    popularProducts = designerProducts.filter((p) => p.popular);
}

function loadProducts() {
    getFeaturedProducts();
    getPopularProducts();
    const featuredRow = document.querySelector("#featuredRow");
    const popularRow = document.querySelector("#popularRow");
    loadMainFeature();
    populateRow(featuredRow, featuredProducts);
    populateRow(popularRow, popularProducts);
}

function loadMainFeature() {
    const randomFeature =
        featuredProducts[Math.floor(Math.random() * featuredProducts.length)];
    createLargeComparison(randomFeature);
}

function createLargeComparison(product) {
    try {
        const dupeID = product.matchingProducts[0][0];
        let dupe = null;
        dupe = dupeProducts.filter((d) => d.productID == dupeID)[0];

        const comparisonLarge = document.querySelector("#mainFeature");

        const cLProduct1 = document.createElement("div");
        cLProduct1.classList.add("cLProduct");
        const cLImage1 = document.createElement("img");
        cLImage1.setAttribute("src", product.image);
        const cLText1 = document.createElement("div");
        cLText1.classList.add("cLText");
        const cLPrice1 = document.createElement("h2");
        cLPrice1.innerText = `$${product.price}`;
        const cLName1 = document.createElement("h3");
        cLName1.innerText = product.name;
        cLProduct1.appendChild(cLImage1);
        cLProduct1.appendChild(cLText1);
        cLText1.appendChild(cLPrice1);
        cLText1.appendChild(cLName1);

        const cLMatch = document.createElement("div");
        cLMatch.classList.add("cLMatch");
        const percentageMatch = document.createElement("p");
        percentageMatch.classList.add("percentageMatch");
        percentageMatch.innerText = `${product.matchingProducts[0][3]}%`;
        cLMatch.appendChild(percentageMatch);

        const cLProduct2 = document.createElement("div");
        cLProduct2.classList.add("cLProduct");
        const cLImage2 = document.createElement("img");
        cLImage2.setAttribute("src", dupe.image);
        const cLText2 = document.createElement("div");
        cLText2.classList.add("cLText");
        const cLPrice2 = document.createElement("h2");
        cLPrice2.innerText = `$${dupe.price}`;
        const cLName2 = document.createElement("h3");
        cLName2.innerText = dupe.name;
        cLProduct2.appendChild(cLImage2);
        cLProduct2.appendChild(cLText2);
        cLText2.appendChild(cLPrice2);
        cLText2.appendChild(cLName2);

        comparisonLarge.appendChild(cLProduct1);
        comparisonLarge.appendChild(cLMatch);
        comparisonLarge.appendChild(cLProduct2);
    } catch (err) {
        console.log("Error loading large comparison!");
    }
}

function populateRow(row, productList) {
    for (let i = 0; i < 3; i++) {
        if (i < productList.length) {
            row.children[1].children[0].appendChild(
                createSmallComparison(productList[i])
            );
        }
    }
}

function createSmallComparison(product) {
    const dupeID = product.matchingProducts[0][0];
    let dupe = null;
    dupe = dupeProducts.filter((d) => d.productID == dupeID)[0];

    const comparisonSmall = document.createElement("a"); //Temp should be div
    comparisonSmall.setAttribute("href", "/pages/product_page.html");
    comparisonSmall.classList.add("comparisonSmall");

    const cSImgBox = document.createElement("div");
    cSImgBox.classList.add("cSImgBox");
    const img1 = document.createElement("img");
    img1.setAttribute("src", product.image);
    const img2 = document.createElement("img");
    img2.setAttribute("src", dupe.image);

    cSImgBox.appendChild(img1);
    cSImgBox.appendChild(img2);

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

    const overallMatch = document.createElement("p");
    overallMatch.classList.add("cLOverall");
    overallMatch.innerText = `${product.matchingProducts[0][3]}%`;

    comparisonSmall.appendChild(cSImgBox);
    comparisonSmall.appendChild(cSInfo);
    comparisonSmall.appendChild(overallMatch);

    return comparisonSmall;
}
