window.onload = function() {
    loadProducts()
  };

let featuredProducts = [];
let popularProducts = [];

function getFeaturedProducts() {
    featuredProducts = designerProducts.filter(f => f.featured);
}

function getPopularProducts() {
    popularProducts = designerProducts.filter(p => p.popular);
}

function loadProducts() {
    getFeaturedProducts();
    getPopularProducts();
    const featuredRow = document.querySelector('#featuredRow');
    const popularRow = document.querySelector('#popularRow');
    populateRow(featuredRow, featuredProducts);
    populateRow(popularRow, popularProducts);
}

function populateRow(row, productList) {
    for (let i=0; i<3; i++) {
        if (i<productList.length) {
            row.children[1].children[0].appendChild(createSmallComparison(productList[i]));
        }
    }
}

function createSmallComparison(product) {
    const dupeID = product.matchingProducts[0][0];
    let dupe = null;
    dupe = dupeProducts.filter(d => d.productID == dupeID)[0]

    const comparisonSmall = document.createElement('div');
    comparisonSmall.classList.add('comparisonSmall');

    const cSImgBox = document.createElement('div');
    cSImgBox.classList.add('cSImgBox');
    const img1 = document.createElement('img');
    img1.setAttribute('src', product.image);
    const img2 = document.createElement('img');
    img2.setAttribute('src', dupe.image);

    cSImgBox.appendChild(img1);
    cSImgBox.appendChild(img2);

    const cSInfo = document.createElement('ul');
    cSInfo.classList.add('cSInfo')
    const productTitle = document.createElement('h3');
    productTitle.innerText = product.name;
    cSInfo.appendChild(productTitle);

    for (let i=1; i<product.matchingProducts[0].length - 1; i++) {
        const li1 = document.createElement('li');
        const cat1 = document.createElement('p');
        cat1.innerText = 'Attribute 1';
        const percentageBar = document.createElement('div');
        percentageBar.classList.add('cSPercentageBar');
        const percentageFill = document.createElement('div');
        percentageFill.style.width = `${product.matchingProducts[0][i]}%`;
        const percentage = document.createElement('p');
        percentage.innerText = `${product.matchingProducts[0][i]}%`;
        cSInfo.appendChild(li1);
        li1.appendChild(cat1);
        li1.appendChild(percentageBar);
        li1.appendChild(percentage);
        percentageBar.appendChild(percentageFill);
    }

    const overallMatch = document.createElement('p');
    overallMatch.classList.add('cLOverall');
    overallMatch.innerText = `${product.matchingProducts[0][3]}%`

    comparisonSmall.appendChild(cSImgBox);
    comparisonSmall.appendChild(cSInfo);
    comparisonSmall.appendChild(overallMatch);

    return comparisonSmall;

}
