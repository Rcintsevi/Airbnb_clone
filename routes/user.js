const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const flash=require("connect-flash");
const wrapAsync=require("../utils/wrapAsync.js");
const {saveRedirectURL}=require("../middleware.js");
const userController=require("../controllers/user.js");


router.get("/signup",wrapAsync(userController.signupForm));


router.post("/signup", wrapAsync(userController.userSignin));

router.get("/login",userController.loginForm);

router.post("/login", saveRedirectURL,passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),userController.userLogin);

router.get("/logout",userController.userLogout);





module.exports=router;