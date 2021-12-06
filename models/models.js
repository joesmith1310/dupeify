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

    age: {
        type: Number,
        required: true,
        trim: true,
    },

    skintype: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    eyecolor: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    birthday: {
        type: Date,
        required: true,
        minLength: 1,
        trim: true,
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
    brand: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    //optional attributes that only exist for designer products
    //[[4, 78, 89, 64, 75, 77]] = [[4 (productID), 78(feature1 match), 89(feature2 match), 64(feature3 match), 75(feature4 match), 77(overall match)]]
    matches: [[mongoose.ObjectId, Number, Number, Number, Number, Number]],
    designer: Boolean,
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

const Dupe = mongoose.model("Dupe", {
    designerProduct: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    dupeProduct: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    cat1: {
        type: Number,
        required: true,
    },
    cat2: {
        type: Number,
        required: true,
    },
    cat3: {
        type: Number,
        required: true,
    },
    cat4: {
        type: Number,
        required: true,
    },
    overall: {
        type: Number,
        required: true,
    },
});


module.exports = { User, Product, Suggestion, Dupe };
