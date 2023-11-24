const router = require("express").Router();
const passport = require("passport");
require('dotenv').config();
require('../passport');


router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

// router.get('/home', passport.authenticate("google", ["profile", "email"]), (req, res)=>{
//     res.render('home');
// })

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: process.env.CLIENT_URL,
		failureRedirect: "/login/failed",
	}), (req,res) =>{
        // res.redirect("/home");
        res.render('home');
    }
);

router.get("/logout", (req, res) => {
	// req.session = null;
	req.logout();
	res.redirect(process.env.CLIENT_URL);
});

module.exports = router;

