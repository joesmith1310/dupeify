const express = require("express");
const app = express();

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("bufferCommands", false); // don't buffer db requests if the db server isn't connected - minimizes http requests hanging if this is the case.

// import the mongoose models
const { User, Product, Suggestion, Dupe, Like } = require("./models/models");

// to validate object IDs
const { ObjectID } = require("mongodb");

const log = console.log;

// const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
// const url = "mongodb+srv://admin:admin@database.vhygo.mongodb.net/test";

// let db;
// MongoClient.connect(url, {
//     useUnifiedTopology: true,
// }).then((cluster) => {
//     db = cluster.db("Database");
//     console.log("Connected to database!");
// });

function isMongoError(error) {
    // checks for first error returned by promise rejection if Mongo database suddently disconnects
    return (
        typeof error === "object" &&
        error !== null &&
        error.name === "MongoNetworkError"
    );
}

app.use(express.json());

app.set("port", process.env.PORT || 5000);

//TODO: should be this instead
//express.static(path.join(__dirname, '/pub'))
app.use(express.static(__dirname));

app.use(cors());
app.options("*", cors());

app.post("/test", function (request, response) {
    response.status(200).send("success!");
});

app.post("/register", async (req, res) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    // Save student to the database
    // async-await version:
    try {
        const result = await user.save();
        res.send(result);
    } catch (error) {
        log(error); // log server error to the console, not to the client.
        if (isMongoError(error)) {
            // check for if mongo server suddenly dissconnected before this request.
            res.status(500).send("Internal server error");
        } else {
            res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
        }
    }
});

app.post("/login", async (req, res) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    // Get the students
    try {
        const user = await User.findOne({
            username: req.body.username,
            password: req.body.password,
        });
        if (user === null) {
            res.status(401).send("Login failed!");
        } else {
            res.status(200).send(user);
        }
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/api/product", async (req, res) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        brand: req.body.brand,
        type: req.body.type,
        description: req.body.description,
        image: req.body.image,
        matches: [],
        designer: req.body.designer,
        featured: req.body.featured,
        popular: req.body.popular,
    });

    log(product);

    try {
        const result = await product.save();
        res.status(200).send(result);
    } catch (error) {
        log(error); // log server error to the console, not to the client.
        if (isMongoError(error)) {
            // check for if mongo server suddenly dissconnected before this request.
            res.status(500).send("Internal server error");
        } else {
            res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
        }
    }
});

app.get("/api/search/:key", async (req, res) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    let searchResults = [];
    try {
        const products = await Product.find();
        if (products != null) {
            for (let i = 0; i < products.length; i++) {
                let search = req.params.key.toUpperCase();
                let productName = products[i].name.toUpperCase();
                let productBrand = products[i].brand.toUpperCase();
                let productType = products[i].type.toUpperCase();
                let productDescription = products[i].description.toUpperCase();
                if (req.params.key == "all") {
                    searchResults.push(products[i]);
                } else if (productName.includes(search)) {
                    searchResults.push(products[i]);
                } else if (productBrand.includes(search)) {
                    searchResults.push(products[i]);
                } else if (productType.includes(search)) {
                    searchResults.push(products[i]);
                } else if (productDescription.includes(search)) {
                    searchResults.push(products[i]);
                }
            }
        }
        res.send({ searchResults });
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/api/link", async (req, res) => {
    // Add code here

    if (
        !ObjectID.isValid(req.body.designerProduct) ||
        !ObjectID.isValid(req.body.dupeProduct)
    ) {
        res.status(404).send(); // if invalid id, definitely can't find resource, 404.
        return;
    }

    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    try {
        const prod1 = await Product.findById(req.body.designerProduct);
        const prod2 = await Product.findById(req.body.dupeProduct);
        if (!prod1 || !prod2) {
            res.status(404).send("Resource not found");
        } else {
            if (prod1.designer && !prod2.designer) {
                const dupe = new Dupe({
                    designerProduct: req.body.designerProduct,
                    dupeProduct: req.body.dupeProduct,
                    cat1: req.body.cat1,
                    cat2: req.body.cat2,
                    cat3: req.body.cat3,
                    cat4: req.body.cat4,
                    overall: req.body.overall,
                });

                try {
                    const result = await dupe.save();
                    res.status(200).send(result);
                } catch (error) {
                    log(error); // log server error to the console, not to the client.
                    if (isMongoError(error)) {
                        // check for if mongo server suddenly dissconnected before this request.
                        res.status(500).send("Internal server error");
                    } else {
                        res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
                    }
                }
            } else {
                res.status(400).send(
                    "Can only link dupe product to designer product"
                );
            }
        }
    } catch (error) {
        log(error); // log server error to the console, not to the client.
        if (isMongoError(error)) {
            // check for if mongo server suddenly dissconnected before this request.
            res.status(500).send("Internal server error");
        } else {
            res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
        }
    }
});

app.get("/api/product", async (req, res) => {
    // Add code here
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    try {
        const products = await Product.find();
        res.send({ products });
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/api/dupes/:id", async (req, res) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    let designerId = req.params.id;
    try {
        const matches = await Dupe.find({ designerProduct: designerId });
        if (!matches) {
            res.send([]);
        } else {
            res.send(matches);
        }
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error"); // server error
    }
});

app.get("/api/dupeList/:id", async (req, res) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    let designerId = req.params.id;
    try {
        const matches = await Dupe.find({ designerProduct: designerId });
        if (!matches) {
            res.status(404); // could not find dupes
        } else {
            let dupes = [];
            await Promise.all(
                matches.map((m) => {
                    return new Promise(async (resolve) => {
                        try {
                            const dupe = await Product.find({
                                _id: m.dupeProduct,
                            });
                            if (dupe) {
                                dupes.push(dupe);
                            }
                        } catch (error) {
                            console.log("Could not find one or more dupes");
                        }
                        resolve();
                    });
                })
            );
            res.send(dupes);
        }
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error"); // server error
    }
});

app.get("/api/product/:id", async (req, res) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    let productId = req.params.id;
    try {
        const match = await Product.find({ _id: productId });
        if (!match) {
            res.status(404);
        } else {
            res.send(match);
        }
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.delete("/api/product/:id", async (req, res) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    let productId = req.params.id;
    try {
        const del = await Product.findOneAndDelete({ _id: productId });
        if (!del) {
            res.status(404);
        } else {
            try {
                const del2 = await Dupe.deleteMany({
                    $or: [
                        { designerProduct: productId },
                        { dupeProduct: productId },
                    ],
                });
                if (!del2) {
                    res.status(404);
                } else {
                    try {
                        const del3 = await Suggestion.deleteMany({
                            dupeof: productId,
                        });
                        if (!del3) {
                            res.status(404);
                        } else {
                            res.send();
                        }
                    } catch (error) {
                        console.log(error);
                        res.status(500).send("Internal Server Error");
                    }
                }
            } catch (error) {
                console.log(error);
                res.status(500).send("Internal Server Error");
            }
        }
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.patch("/api/users/:id", async (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        return; // so that we don't run the rest of the handler.
    }

    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    // Find the fields to update and their values.
    const fieldsToUpdate = {};
    req.body.map((change) => {
        const propertyToChange = change.path.substr(1); // getting rid of the '/' character
        fieldsToUpdate[propertyToChange] = change.value;
    });

    // Update the student by their id.
    try {
        const user = await User.findOneAndUpdate(
            { _id: id },
            { $set: fieldsToUpdate },
            { new: true, useFindAndModify: false }
        );
        if (!user) {
            res.status(404).send("Resource not found");
        } else {
            res.send(user);
        }
    } catch (error) {
        log(error);
        if (isMongoError(error)) {
            // check for if mongo server suddenly dissconnected before this request.
            res.status(500).send("Internal server error");
        } else {
            res.status(400).send("Bad Request"); // bad request for changing the user.
        }
    }
});

app.get("/api/users/:id", async (req, res) => {
    // Add code here
    const id = req.params.id;

    // Good practise: Validate id immediately.
    if (!ObjectID.isValid(id)) {
        res.status(404).send(); // if invalid id, definitely can't find resource, 404.
        return; // so that we don't run the rest of the handler.
    }

    // If id valid, findById
    try {
        const user = await User.findById(id);
        if (!user) {
            res.status(404).send("Resource not found"); // could not find this restaurant
        } else {
            res.send(user);
        }
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error"); // server error
    }
});

app.post("/api/login", async (req, res) => {
    uname = req.body.username;
    pword = req.body.password;

    try {
        log(uname);
        log(pword);
        const user = await User.findOne({
            username: uname,
            password: pword,
        }).lean();
        if (!user) {
            return res.json({ status: "error", error: "Not found!" });
        }
        return res.json({ status: "ok", uid: user._id, admin: user.admin });
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.patch("/api/product/:id/:feature", async (req, res) => {
    // Add code here
    const id = req.params.id;
    const feature = req.params.feature;

    // Good practise: Validate id immediately.
    if (!ObjectID.isValid(id)) {
        res.status(404).send(); // if invalid id, definitely can't find resource, 404.
        return; // so that we don't run the rest of the handler.
    }

    // If id valid, findById
    try {
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).send("Resource not found"); // could not find this restaurant
        } else {
            if (!product.designer) {
                res.status(400).send(
                    "Only designer products can be popular or featured."
                );
            }
            let update = null;
            if (feature == "featured") {
                if (product.featured) {
                    update = await Product.updateOne(
                        { _id: id },
                        { $set: { featured: false } }
                    );
                    res.send({ msg: "Product is no longer featured." });
                } else {
                    update = await Product.updateOne(
                        { _id: id },
                        { $set: { featured: true } }
                    );
                    res.send({ msg: "Product is now featured!" });
                }
            } else if (feature == "popular") {
                if (product.popular) {
                    update = await Product.updateOne(
                        { _id: id },
                        { $set: { popular: false } }
                    );
                    res.send({ msg: "Product is no longer popular." });
                } else {
                    update = await Product.updateOne(
                        { _id: id },
                        { $set: { popular: true } }
                    );
                    res.send({ msg: "Product is now popular!" });
                }
                res.send();
            }
        }
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error"); // server error
    }
});

app.post("/api/register", async (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    const r_username = req.body.username;
    const r_password = req.body.password;
    const r_age = req.body.age;
    const r_skintype = req.body.skintype;
    const r_eyecolor = req.body.eyecolor;
    const r_birthday = req.body.birthday;
    const r_admin = false;

    if (!r_username || typeof r_username !== "string") {
        return res.json({ status: "error", error: "Invalid username" });
    }

    if (!r_password || typeof r_password !== "string") {
        return res.json({ status: "error", error: "Invalid password" });
    }

    const user = new User({
        username: r_username,
        password: r_password,
        age: r_age,
        skintype: r_skintype,
        eyecolor: r_eyecolor,
        birthday: r_birthday,
        admin: r_admin,
    });
    try {
        const existing_user = await User.findOne({
            username: r_username,
            password: r_password,
        }).lean();
        if (existing_user) {
            return res.json({
                status: "error",
                error: "username already exists!",
            });
        }

        const result = await user.save();
        return res.json({ status: "ok" });
        //res.send(result)
        console.log("User registered successfully!");
    } catch (error) {
        throw error;
    }

    //res.json({ status: 'ok' })
});

app.post("/api/suggestion", async (req, res) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    let suggestion = null;

    if (req.body.isDesigner) {
        suggestion = new Suggestion({
            userid: req.body.userid,
            type: req.body.type,
            brand: req.body.brand,
            name: req.body.name,
            comment: req.body.comment,
            isDesigner: true,
            approved: 0,
        });
    } else {
        suggestion = new Suggestion({
            userid: req.body.userid,
            type: req.body.type,
            brand: req.body.brand,
            name: req.body.name,
            comment: req.body.comment,
            isDesigner: false,
            dupeof: req.body.dupeof,
            approved: 0,
        });
    }

    try {
        const result = await suggestion.save();
        res.status(200).send(result);
    } catch (error) {
        log(error); // log server error to the console, not to the client.
        if (isMongoError(error)) {
            // check for if mongo server suddenly dissconnected before this request.
            res.status(500).send("Internal server error");
        } else {
            res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
        }
    }
});

app.get("/api/suggestion/:uid", async (req, res) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    let uid = req.params.uid;
    try {
        const matches = await Suggestion.find({ userid: uid });
        if (!matches) {
            res.send([]);
        } else {
            res.send(matches);
        }
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error"); // server error
    }
});

app.get("/api/suggestion", async (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    try {
        const suggestions = await Suggestion.find({ approved: 0 });
        res.send(suggestions);
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.patch("/api/suggestion", async (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    let sid = req.body.sid;
    let decision = req.body.decision;
    try {
        const update = await Suggestion.updateOne(
            { _id: sid },
            { $set: { approved: decision } }
        );
        if (!update) {
            res.status(404).send("Suggestion not found.");
        } else {
            res.send();
        }
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error");
    }
});

/*
{
    user: 
    product:
    like:
}
*/
app.post("/api/get-like", async (req, res) => {
    if (
        !ObjectID.isValid(req.body.user) ||
        !ObjectID.isValid(req.body.product)
    ) {
        res.status(404).send(); // if invalid id, definitely can't find resource, 404.
        return;
    }

    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    try {
        const user = await User.findById(req.body.user);
        const product = await Product.findById(req.body.product);
        if (!user || !product) {
            res.status(404).send("Resource not found");
        } else {
            const document = await Like.findOne({
                user: req.body.user,
                product: req.body.product,
            });
            res.status(200).send(document);
        }
    } catch (error) {
        log(error); // log server error to the console, not to the client.
        if (isMongoError(error)) {
            // check for if mongo server suddenly dissconnected before this request.
            res.status(500).send("Internal server error");
        } else {
            res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
        }
    }
});

app.post("/api/like", async (req, res) => {
    if (
        !ObjectID.isValid(req.body.user) ||
        !ObjectID.isValid(req.body.product)
    ) {
        res.status(404).send(); // if invalid id, definitely can't find resource, 404.
        return;
    }

    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    try {
        const user = await User.findById(req.body.user);
        const product = await Product.findById(req.body.product);
        if (!user || !product) {
            res.status(404).send("Resource not found");
        } else {
            const document = await Like.findOneAndUpdate(
                {
                    user: req.body.user,
                    product: req.body.product,
                },
                { $set: { like: req.body.like } },
                {
                    useFindAndModify: false,
                    upsert: true,
                    returnDocument: "after",
                }
            );
            //upsert means if no documents found, it will insert a new document
            res.status(200).send(document);
        }
    } catch (error) {
        log(error); // log server error to the console, not to the client.
        if (isMongoError(error)) {
            // check for if mongo server suddenly dissconnected before this request.
            res.status(500).send("Internal server error");
        } else {
            res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
        }
    }
});

app.post("/api/get-like-percentage", async (req, res) => {
    if (!ObjectID.isValid(req.body.product)) {
        res.status(404).send(); // if invalid id, definitely can't find resource, 404.
        return;
    }

    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    try {
        const likes = await Like.find({ product: req.body.product });
        let count = 0;
        for (const doc of likes) {
            if (doc.like) {
                count++;
            }
        }
        res.status(200).send({ percentage: count / likes.length });
        //returns null if the product has never been rated before
    } catch (error) {
        log(error); // log server error to the console, not to the client.
        if (isMongoError(error)) {
            // check for if mongo server suddenly dissconnected before this request.
            res.status(500).send("Internal server error");
        } else {
            res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
        }
    }
});

app.post("/api/get-like-user", async (req, res) => {
    if (!ObjectID.isValid(req.body.user)) {
        res.status(404).send(); // if invalid id, definitely can't find resource, 404.
        return;
    }

    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    try {
        const likes = await Like.find({ user: req.body.user, like: true });
        res.status(200).send(likes.map((document) => document.product));
    } catch (error) {
        log(error); // log server error to the console, not to the client.
        if (isMongoError(error)) {
            // check for if mongo server suddenly dissconnected before this request.
            res.status(500).send("Internal server error");
        } else {
            res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
        }
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    log(`Listening on port ${port}...`);
});
