const mongoose = require("mongoose");

const User = mongoose.model("User", {
    username: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: Boolean,
});

const Product = mongoose.model("Product", {
    name: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    //optional attributes that only exist for designer products
    //[[4, 78, 89, 64, 75, 77]] = [[4 (productID), 78(feature1 match), 89(feature2 match), 64(feature3 match), 75(feature4 match), 77(overall match)]]
    matches: [[mongoose.ObjectId, Number, Number, Number, Number, Number]],
    featured: Boolean,
    popular: Boolean,
});
//TODO product images?

const Suggestion = mongoose.model("Suggestion", {
    product_type: {
        //TODO what data type?
        // required: true,
    },
    brand: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    comment: String,
});

module.exports = { User, Product, Suggestion };
