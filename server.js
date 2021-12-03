const express = require("express");
const app = express();

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("bufferCommands", false); // don't buffer db requests if the db server isn't connected - minimizes http requests hanging if this is the case.

// import the mongoose models
const { User, Product, Suggestion, Dupe } = require("./models/models");

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

function isMongoError(error) { // checks for first error returned by promise rejection if Mongo database suddently disconnects
	return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
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
        featured: true,
        popular: true,
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
        const products = await Product.find()
        if (products != null) {
            for (let i = 0; i < products.length; i++) {
                let search = req.params.key.toUpperCase();
                console.log(search);
                let productName = products[i].name.toUpperCase();
                let productBrand = products[i].brand.toUpperCase();
                let productType = products[i].type.toUpperCase();
                console.log(productType);
                let productDescription = products[i].description.toUpperCase();
                if (productName.includes(search)) {
                    searchResults.push(products[i]);
                }
                else if (productBrand.includes(search)) {
                    searchResults.push(products[i]);
                }
                else if (productType.includes(search)) {
                    searchResults.push(products[i]);
                }
                else if (productDescription.includes(search)) {
                    searchResults.push(products[i]);
                }
            }
        }
        res.send({searchResults});
    } catch (error) {
        log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/api/link', async (req, res) => {
	// Add code here

	if (!ObjectID.isValid(req.body.designerProduct) || !ObjectID.isValid(req.body.dupeProduct)) {
        console.log("ERROR1");
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;
	}

	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

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

})

app.get('/api/product', async (req, res) => {
	// Add code here
	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}
	try {
		const products = await Product.find()
		res.send({ products })
	} catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}

})

app.get("/api/dupes/:id", async (req, res) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    let designerId = req.params.id;
    try {
        const matches = await Dupe.find({designerProduct: designerId})
        if (!matches) {
			res.status({})  // could not find this restaurant
		} else { 
			res.send(matches)
		}
	} catch(error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}
});




app.listen(app.get("port"));
