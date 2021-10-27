window.onload = function() {
    loadProducts()
  };

const featuredProducts = [];

function getFeaturedProducts() {
    for (let i=0; i<designerProducts.length; i++) {
        if (designerProducts[i].featured) {
            featuredProducts.push(designerProducts[i])
        }
    }
}

function loadProducts() {
    getFeaturedProducts();
    const featuredRow = document.querySelector("#featuredRow");
    console.log(featuredProducts);
    populateRow(featuredRow, featuredProducts);
}

function populateRow(row, productList) {
    row.children[1].children[0].appendChild(createSmallComparison(productList[1]));

}

function createSmallComparison(product) {
    const dupeID = product.matchingProducts[0][0];
    let dupe = null;
    for (let i=0; i<dupeProducts.length; i++) {
        if (dupeProducts[i].productID == dupeID) {
            dupe = dupeProducts[i];
        }
    }
    const comparisonSmall = document.createElement('div');
    comparisonSmall.classList.add('comparisonSmall');
    const cSImgBox = document.createElement('div');
    cSImgBox.classList.add('cSImgBox');
    const img1 = document.createElement('img');
    img1.setAttribute('src', product.image);
    const img2 = document.createElement('img');
    img2.setAttribute('src', dupe.image);

    comparisonSmall.appendChild(cSImgBox);
    cSImgBox.appendChild(img1);
    cSImgBox.appendChild(img2);

    return comparisonSmall;

}
