const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();


router.get("/", async (req, res) => {
    const users = await loadUserCollection();
    res.send(await users.find().toArray());
});

router.post("/register", async (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    if (name == null || password == null) {
        res.status(400).send("cannot be empty")
    }
    const users = await loadUserCollection();
    users.insertOne({
        name: name,
        password: password
    });
    res.send("inserted");
});

async function loadUserCollection() {
    const client = await mongodb.MongoClient.connect('mongodb+srv://user:user@cluster0.bzsge.mongodb.net/AppleStore?retryWrites=true&w=majority', {useNewUrlParser: true});
    return client.db("AppleStore").collection("users");
}

module.exports = router;