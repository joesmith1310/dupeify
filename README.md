# team55

We received an extension from Mark as one of our Team members dropped this course last minute.

Out Deployment link https://glacial-sands-13192.herokuapp.com/

### Setup instructions

## (must install mongodb first.)

## Install all modules

$ npm install

## Start a mongo server

$ mkdir mongo-data
$ mongod --dbpath ./mongo-data

## Start web server

$ npm start

## Registration for a User

The current users in our database are
Username: user, Password: user
Username: user1 , Password: user
Username: user2, Password:user

If a User does not have an account and wishes to create one then they can go to our Log In page and click the link below that says "Register now". In the Registration form, the User must create a Username that is not in our database and input information needed for their account. Once it says " Successfully Registered" the User will be taken to the Log In page to Log in.

## Logging In As an User

You can log in as a user using credentials username = `user` and password = `user`. Once the User logs in, they will be taken to the Homepage where they can explore our website. They can click on our featured and popular items which will take them to that specific product page.

## Logging In As an Admin

For admin use username = `admin` and password = `admin`. As admin you are able to add new products, delete products, edit existing ones, see user recommendations and remove users.

To add designer Products the admin will fill out the "Add Products" page.
To add dupes the admin will fill out the "Add Dupes" page.

In order to link the dupe to the designer product, the admin will have to take the object ids from the database and fill out the percentage of how much they match.

The admin will also be able to search and make sure they do not add any duplicate products into the database.

The product toggle allows the admin to choose what they want to be featured on the homepage.

In the Users section of the admin page, the admin can approve or reject suggestions sent in by the users and delete any users.

## Using the Home Page

The home page allows users to click on featured and popular products to view information about them including their dupes. You can also search for a specific product using the search bar which will return a results page displaying matching products.

## How to use My Account

In the Accounts page, the user may edit their personal information. While they can edit the name displayed on their account, it will not change their Log In information, it will only change the username displayed on their view of the Account sort of like a Nickname.

The likes list is a list of all the products the User has liked and they are able to remove the products from their list.

The suggestion form is for the User to suggest Designer products that they wish to see dupes for on our site. Once they suggest something, it will show up with either an "Approved","Rejected" or "Pending" status. The dupes that they suggested on the Product Pages will also show up here.

## Products List Page

The page simply displays a list of products. Each product entry can be clicked on which will lead to the product's specific page. The list of products can be sorted by price and name. It can also filter the product list by which category of products they wish to see. If they click on "Nars Blush", They will be able to see a list of dupes. This list can be sorted by price. The User will also be able to thumbs up or thumbs down a product. The thumbs up will add it to their "likes" list which can be found in the "My Account" page. The thumbs up and down will showcase how much a product is liked by the users on our website. The User can also suggest a dupe on each product page and fill out the form. The suggestion will be sent to Admin and the User will be able to see their pending suggestion in their Account page.

## Express Routes

### POST /api/product

Expects a json object in the request body with the following structure:

```json
{
    "name": String,
    "price": Number,
    "brand": String,
    "type": String,
    "description": String,
    "image": String,
    "designer": Boolean,
    "featured": Boolean,
    "popular": Boolean,
}
```

Creates a document and saves the product in the Product database. Responds with the JSON representing the document you have just created.

### GET /api/search/:key

Expects the search term as a url parameter. Searches through products in the database to see if search term is in the name, brand or type of any product. Returns the array of JSON objects representing products that match the search term.

### POST /api/link

Expects a json object in the request body with the following structure:

```json
{
    "cat1": Number,
    "cat2": Number,
    "cat3": Number,
    "cat4": Number,
    "overall": Number,
    "designerProduct": String, (Mongoose product id)
    "dupeProduct": String, (Mongoose produt id)
}
```

Creates a document in the Dupe database which represents the relationship between a designer product and a dupe product. Responds with the JSON representing the document you have just created.

### GET /api/product

Responds with an array of JSON objects representing all products in the Product database.

### GET /api/user

Responds with an array of JSON objects representing all users in the User database.

### GET /api/dupes/:id

Expects the mongoose id of a designer product as a url parameter. Responds with a list of JSON objects each representing a product match from the Dupe database. Note: This does not return a list of the dupe products themselves but a list of match information objects i.e. designerid, dupeid, category 1 match, category 2 match etc.

### GET /api/dupesList/:id

Expects the mongoose id of a designer product as a url parameter. Repsonds with a list of JSON objects each representing a dupe match of the designer product. So this returns an array of dupe products of that specific designer product.

### GET /api/product/:id

Expects the mongoose id of a product as a url parameter. Responds with the product that matches the product ID.

### DELETE /api/product/:id

Expects the mongoose id of a product as a url parameter. The corresponding product gets deleted from the database.

### PATCH /api/product/:id/:feature

Expects the moongoose id of a product as url parameter and feature as the second parameter. ( i.e either as featured or popular). This toggles the product feature and popular status so that the featured one become unfeatured and the popular one become unpopular and vice versa.

### POST /api/register

Expects a json object in the request body with the following structure:

```json
{
    "username": String,
    "password": String,
    "age": Number,
    "skintype": String,
    "eyecolor": String,
    "birthday": Date,
}
```

Creates a user in the database with the above fields. Returns a json of `{ status: "ok" }` on success.

### POST /api/suggestion

Expects a json object in the request body with the following structure:

```json
{
    "userid": ObjectId,
    "type": String,
    "brand": String,
    "name": String,
    "comment": String,
    "isdesigner": Boolean,
    "approved": int (0,1,-1)
}
```

Creates a suggestion in the database with the above fields.

### GET /api/suggestion/:uid

Expects the mongoose id of a User as a url parameter. Responds with all the suggestions that the User created.

### GET /api/suggestion

Returns a list of pending suggestions.

### PATCH /api/suggestion

Update suggestion based on suggestion id and changes the status to either approved(1), pending(0) or rejected (-1).

### /api/get-like

Expects a json object in the request body with the following structure:

```json
{
    "user": ObjectId,
    "product": ObjectId,
}
```

Gets whether or not the specified user gave a thumbs up or thumbs down for the product. Returns a document with the following structure:

```json
{
    "_id": { "$oid": "61b11dc343c51cd49b4891a6" },
    "product": { "$oid": "61b0e00ff165316088157be3" },
    "user": { "$oid": "61a7fcdf2924f422f8094475" },
    "__v": 0,
    "like": false //true if thumbs up, false if thumbs down
}
```

### POST /api/like

Expects a json object in the request body with the following structure:

```json
{
    "user": ObjectId,
    "product": ObjectId,
    "like": Boolean
}
```

Sets whether or not the specified user gave a thumbs up or thumbs down for the product. If no document exists, it will create a new one. Returns the updated document on success.

### POST /api/get-like-percentage

Expects a json object in the request body with the following structure:

```json
{
    "product": ObjectId,
}
```

Returns the like percentage of the product in a json: `{ percentage: 0.4 }`. `percentage` will be `null` if the product has never been liked/disliked.

### POST /api/get-like-user

Expects a json object in the request body with the following structure:

```json
{
    "user": ObjectId,
}
```

Returns an array of ids of the products that the specified user has liked. Example response:

```json
[
    "61b135fc61fad53588f21578",
    "61b0e194f165316088157be8",
    "61b1393c61fad53588f215c5"
]
```

### DELETE /api/user/:id

Expects the mongoose id of a User as a url parameter and deletes the user from the database.
