const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const flash=require("connect-flash");
const wrapAsync=require("../utils/wrapAsync.js");
const {saveRedirectURL}=require("../middleware.js");



router.get("/signup",wrapAsync(async (req,res)=>{
    res.render("users/signup.ejs");
}));


router.post("/signup", wrapAsync(async (req,res,next)=>{
    try{
        let {username,email,password}=req.body;
    let user1=new User({
        username:username,
        email:email,
    });
    let registeredUser= await User.register(user1,password);
    
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        console.log(registeredUser);
        req.flash("success","A new user was succesfully registered");
        res.redirect("/listings");
    });
    

    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    

}));

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectURL,passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),async (req,res)=>{
    req.flash("success","Welcome to Airbnb, you are logged in");
    console.log(res.locals.redirectURL);
    const redirectUrl=res.locals.redirectURL || "/listings";
    res.redirect(redirectUrl);

});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","You have logged out successfully");
            res.redirect("/listings");
        }
    });
    
});





module.exports=router;