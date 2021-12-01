const express = require("express");
const app = express();

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("bufferCommands", false); // don't buffer db requests if the db server isn't connected - minimizes http requests hanging if this is the case.

// import the mongoose models
const { User, Product, Suggestion } = require("./models/models");

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

app.listen(app.get("port"));
