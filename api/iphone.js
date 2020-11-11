const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const userMiddleware = require("../validation");

router.get("/", async (req, res) => {
    const iphones = await loadIphoneCollection();
    res.send(await iphones.find().toArray());
});

router.post("/upload", userMiddleware.isLoggedIn, async (req, res) => {
    let iphone = {
        uploader: req.userData.email,
        model: req.body.model,
        price: req.body.price,
        color: req.body.color
    }

    if (iphone.model && iphone.price && iphone.color) {
        const iphones = await loadIphoneCollection();
        iphones.insertOne(iphone);
        res.status(201).send({msg: "Hozzáadva az új tipus"});
    }
})


async function loadIphoneCollection() {
    const client = await mongodb.MongoClient.connect('mongodb+srv://user:user@cluster0.bzsge.mongodb.net/AppleStore?retryWrites=true&w=majority', {useNewUrlParser: true});
    return client.db("AppleStore").collection("iphone");
}

module.exports = router;