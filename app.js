const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const user = require("./user");

const port = process.env.PORT || 8080;

app.use(express.json());
app.use("/user", user);


app.listen(port, () => {
    console.log("Server is running on " + port)
});
//});

app.get("/helloworld", (req, res) => {
    res.send("Hello World");
});
