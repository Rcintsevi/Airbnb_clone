const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const flash=require("connect-flash");
const wrapAsync=require("../utils/wrapAsync.js");
const {saveRedirectURL}=require("../middleware.js");
const userController=require("../controllers/user.js");



//Using router.route() for more modularity

router.route("/signup")
.get(wrapAsync(userController.signupForm))
.post(wrapAsync(userController.userSignin));

router.route("/login")
.get(userController.loginForm)
.post(saveRedirectURL,passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),userController.userLogin);



router.get("/logout",userController.userLogout);





module.exports=router;