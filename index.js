const express = require("express");
const app = express();
const path = require('path');
const session = require('express-session');
app.use(express.json());
const bodyParser = require('body-parser');
app.use(express.static('public'))
app.use(session({ secret: "enc-key", saveUninitialized: false, resave: false }))
const { MongoClient } = require('mongodb');
app.set("view engine", "ejs")
const client = new MongoClient('mongodb+srv://vivek:Vivek%40123@cluster1.7a1bjrg.mongodb.net/');
// async function connectToMongo() {
//     try {
//       await client.connect();
//       console.log('Connected to MongoDB successfully.');

//     } catch (error) {
//       console.error('Error connecting to MongoDB:', error);
//     }
//   }

//   connectToMongo();
async function commonFunc(DB, Collection, Data, ProcessFlag) {
  var data;
  try {
    await client.connect();
    const db = client.db(DB); // database name
    const collection = db.collection(Collection); // collection name
    switch (ProcessFlag) {
      case "insert":
        const insertResult = await collection.insertOne(Data);
        console.log('Inserted document:', insertResult.insertedId);
        return insertResult.insertedId;
        break;
      case "display":
        // const query = Data; 
        // const allDocuments = await collection.find(query).toArray();
        // console.log('All documents in the collection:', allDocuments);
        // console.log(Data)
        const query = Data;
        // const matchingDocuments = await collection.find(query).toArray();
        const matchingDocuments = await collection.findOne(query);
        // console.log('Documents matching the query:', matchingDocuments);
        // return matchingDocuments;
        // if (matchingDocuments) {
        //     // console.log('Data exists:', matchingDocuments);
        // } else {
        //     return false;
        // }
        return matchingDocuments;
        break;
      default:
        client.close().then(() => {
          console.log('Connection to MongoDB closed successfully.');
        });
        break;
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  // res.send("Hello world");
  res.render('index.ejs', { username: false });
})
app.get("/login", (req, res) => {
  // const filePath = path.join(__dirname, 'public/login.html');

  // res.sendFile(filePath);
  res.render("login")
})
app.get("/register", (req, res) => {
  // const filePath = path.join(__dirname, 'public/register.html');
  res.render("register")
  // res.sendFile(filePath);
})
app.get("/products", (req, res) => {
  // const filePath = path.join(__dirname, 'public/register.html');
  res.render("products")
  // res.sendFile(filePath);
})
app.get("/logout", (req, res) => {
  // const filePath = path.join(__dirname, 'public/register.html');
  if (req.session.loggedin) {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          res.clearCookie("connect.sid")
          res.render('index.ejs', { username: false });
        }
      });

    }

  } else {
    res.render('index.ejs', { username: false });
  }
  // res.sendFile(filePath);
})
app.post('/auth', async (req, res) => {
  const data = req.body;
  // const id = commonFunc('ecommerce','products',data,'insert');
  console.log(data)
  const valid = await commonFunc('ecommerce', 'products', data, 'display');
  console.log(valid);
  if (valid._id !== "" && valid._id !== null) {
    req.session.loggedin = valid._id;
    res.render('index.ejs', { username: req.session.loggedin });
  }
  // res.end(JSON.stringify(valid));


});
app.post('/register', async (req, res) => {
  const data = req.body;
  const id = commonFunc('ecommerce', 'products', data, 'insert');
  console.log(id)
  if (id !== "" && id !== null) {
    res.end(JSON.stringify(id));
  } else {
    res.end("not valid")
  }
});
app.listen(8000, () => {
  console.log("http://localhost:8000")
})