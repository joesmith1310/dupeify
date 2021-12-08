const content = document.getElementById('homeContent');
content.style.display="none";
const loader = createLoader(document.body);

window.onload = async function () {
    await loadProductsPromise;
    loadProducts();
    document.body.removeChild(loader);
    content.style.display = 'initial';
};

function searchProduct() {
    const form = document.getElementById('searchBar');
    let key = form.search.value;
    window.location.href = `/pages/products.html?search=${key}`;
}

let featuredProducts = [];
let popularProducts = [];

function getFeaturedProducts() {
    let featured = designerProducts.filter((f) => f.featured);
    featuredProducts = featured.filter((f) => f.matchingProducts.length > 0);
}

function getPopularProducts() {
    let popular = designerProducts.filter((p) => p.popular);
    popularProducts = popular.filter((p) => p.matchingProducts.length > 0);
}

function loadProducts() {
    getFeaturedProducts();
    getPopularProducts();
    const featuredRow = document.querySelector("#featuredRow");
    const popularRow = document.querySelector("#popularRow");
    loadMainFeature();
    showSlides();
    populateRow(featuredRow, featuredProducts);
    populateRow(popularRow, popularProducts);
}

function loadMainFeature() {
    const numberOfSlides = 3;
    let count = 0;
    while (count < numberOfSlides) {
        let randomFeature = featuredProducts[Math.floor(Math.random() * featuredProducts.length)];
        createLargeComparison(randomFeature);
        count += 1;
    }
}

function createLargeComparison(product) {
    
    if (product.matchingProducts[0].length < 1) {
        return false;
    }
    const dupeID = product.matchingProducts[0][0];

    let dupe = dupeProducts.filter((d) => d.productID == dupeID)[0];    

    const comparisonLarge = document.querySelector("#mainFeature");

    const slide = document.createElement("a");
    slide.setAttribute("href", `/pages/product_page.html?productid=${product.productID}`);
    slide.classList.add("mySlides");
    slide.classList.add("fade");
    slide.classList.add("comparisonLarge");

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

    const featureBadge = document.createElement('div');
    featureBadge.innerHTML = 'Featured &#9733;'
    featureBadge.classList.add('featureBadge');
    comparisonLarge.appendChild(featureBadge);

    slide.appendChild(cLProduct1);
    slide.appendChild(cLMatch);
    slide.appendChild(cLProduct2);
    comparisonLarge.appendChild(slide);
    
    return true;
}

var slideIndex = 0;

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 3000);
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

    const comparisonSmall = document.createElement("a");
    comparisonSmall.setAttribute("href", `/pages/product_page.html?productid=${product.productID}`);
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
        if (i == 1) {
            cat1.innerText = "Color";
        }
        if (i == 2) {
            cat1.innerText = "Texture";
        }
        if (i == 3) {
            cat1.innerText = "Ingredients";
        }
        if (i == 4) {
            cat1.innerText = "Longevity";
        }
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
