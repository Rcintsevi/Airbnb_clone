const User=require("../models/user.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.signupForm=async (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.userSignin=async (req,res,next)=>{
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
    

}

module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.userLogin=async (req,res)=>{
    req.flash("success","Welcome to Airbnb, you are logged in");
    console.log(res.locals.redirectURL);
    const redirectUrl=res.locals.redirectURL || "/listings";
    res.redirect(redirectUrl);

}

module.exports.userLogout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","You have logged out successfully");
            res.redirect("/listings");
        }
    });
    
}