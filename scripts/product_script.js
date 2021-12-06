const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('productid')
console.log(productId);

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