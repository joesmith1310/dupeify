const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const url = "mongodb+srv://admin:admin@database.vhygo.mongodb.net/test";

let db;
MongoClient.connect(url, {
    useUnifiedTopology: true,
}).then((cluster) => {
    db = cluster.db("Database");
    console.log("Connected to database!");
});

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

app.post("/register", function (request, response) {
    db.collection("users")
        .insertOne({
            username: request.body.username,
            password: request.body.password,
        })
        .then(function (result) {
            response
                .status(200)
                .send("The inserted document id is " + result.insertedId);
        });
});

app.post("/login", function (request, response) {
    db.collection("users")
        .findOne({
            username: request.body.username,
            password: request.body.password,
        })
        .then(function (result) {
            if (result === null) {
                response.status(401).send("Login failed");
            } else {
                //result is the document
                console.log(result);
                response.status(200).send("Login successful!");
            }
        });
});

app.listen(app.get("port"));
