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
    };

    if (iphone.model && iphone.price && iphone.color) {
        const iphones = await loadIphoneCollection();
        let response = await iphones.insertOne(iphone);
        if (response.insertedId) {
            return res.status(201).send({msg: "Hozzáadva az új tipus! response-ja: " + response.insertedId});
        }
        res.status(403).send({"msg": "Nem sikerült valamiért"})

    }
    res.status(400).send({"msg": "Nem sikerült, hiányzik valamelyik adat"})
});

router.delete("/:id", userMiddleware.isLoggedIn, async (req, res) => {
    let user = req.userData.email;
    let id = req.params.id;
    if (id && user) {
        const logger = await loadLogCollection();
        const iphones = await loadIphoneCollection();
        logger.insertOne({
            user: user,
            information: "atempted deleting iphone with id of " + id,
            date: new Date().getTime()
        });
        let success = iphones.deleteOne({_id: new mongodb.ObjectID(id)});
        if (success) {
            logger.insertOne({
                user: user,
                information: "iphone with the id of " + id + " has been deleted",
                date: new Date().getTime()
            });
            res.status(202).send({msg: "deleted"});
        }
    }


})


async function loadIphoneCollection() {
    const client = await mongodb.MongoClient.connect('mongodb+srv://user:user@cluster0.bzsge.mongodb.net/AppleStore?retryWrites=true&w=majority', {useNewUrlParser: true});
    return client.db("AppleStore").collection("iphone");
}

async function loadLogCollection() {
    const client = await mongodb.MongoClient.connect('mongodb+srv://user:user@cluster0.bzsge.mongodb.net/AppleStore?retryWrites=true&w=majority', {useNewUrlParser: true});
    return client.db("AppleStore").collection("log");
}

module.exports = router;