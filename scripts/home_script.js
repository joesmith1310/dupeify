window.onload = function() {
    loadProducts()
  };

const allProducts = [testProduct1, testProduct2, testProduct3, testProduct4, testProduct5, testProduct6]
const featuredProducts = [testProduct1, testProduct2, testProduct3]
const popularProducts = [testProduct4, testProduct5, testProduct6]

function loadProducts() {
    const featuredRow = document.querySelector("#featuredRow");
    populateRow(featuredRow, featuredProducts);
}

function populateRow(row, productList) {


}

function createSmallComparison(product) {

}