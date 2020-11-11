const passport = require("passport");
const Strategy = require("passport-facebook").Strategy;

passport.use(new Strategy({
        clientID: "1073895849730583",
        clientSecret: "7010e375fe43d88512b9f946a059ad77",
        callbackURL: "/user/wellcome"
    },
    function (accessToken, refresToken, profile, next) {
        var user = {
            "name": profile.name.familyName + " " + profile.name.givenName,
            "id": profile.id,
            'token': accessToken
        }

        return next(null, user);

    }));

passport.serializeUser(function (user, next) {
    next(null, user);
});
passport.deserializeUser(function (obj, next) {
    next(null, obj);

})

exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {

        return next();
    }
    res.status(400).send({msg: "not logged in"});

}