console.log("Script1 loaded");

//JQUERY
$(document).ready(function(){    
    
    $(function(){
        $("#navbar").load("/pages/nav_bar.html")
    });

});

class Product {
	constructor(productID, name, price, image) {
        this.productID = productID;
		this.name = name;
		this.price = price;
        this.image = image;
	}
}

class DesignerProduct extends Product {
    constructor(productID, name, price, image, matchingProducts, featured, popular) {
        super(productID, name, price, image);
        this.matchingProducts = matchingProducts;
        this.featured = featured;
        this.popular = popular;
	}
}
/* ------------- TEMPORARY FOR FRONT END DEVELOPMENT -------------- */

/* --------- USED TO SIMULATE LOADING DATA FROM DATABASE ---------- */
//[[4, 78, 89, 64, 75, 77]] = [[4 (productID), 78(feature1 match), 89(feature2 match), 64(feature3 match), 75(feature4 match), 77(overall match)]]
const testProduct1 = new DesignerProduct(1, "Test Product 1", 19.99, "/resources/sample-img-1.jpg", [[4, 78, 89, 64, 75, 77]], true, true);
const testProduct2 = new DesignerProduct(2, "Test Product 2", 39.99, "/resources/sample-img-2.jpg", [[5, 80, 74, 78, 91, 81]], true, true);
const testProduct3 = new DesignerProduct(3, "Test Product 3", 49.99, "/resources/sample-img-3.jpg", [[6, 64, 75, 82, 91, 78]], true, true);
const testDupe1 = new Product(4, "Test Product 4", 10.99, "/resources/sample-img-4.jpg");
const testDupe2 = new Product(5, "Test Product 5", 24.99, "/resources/sample-img-5.jpg");
const testDupe3 = new Product(6, "Test Product 6", 32.99, "/resources/sample-img-6.jpg");

const designerProducts = [testProduct1, testProduct2, testProduct3];
const dupeProducts = [testDupe1, testDupe2, testDupe3];

/* ---------------------------------------------------------------- */
