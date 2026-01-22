if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const flash=require("connect-flash");
const session=require("express-session");
const MongoStore = require('connect-mongo').default;


const dbUrl=process.env.ATLASDB_URL;
//To set up sesssion store using Connect-mongo
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"mysecretcode"
    },
    touchAfter:24*3600                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         


});
store.on("error", ()=>{
    console.log("Sonme error occured in mongo-session");
});


const sessionOptions={
    store,
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};


const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");






//Setting up server
app.listen(8080,()=>{
    console.log("The server is listening to port 8080");
});

//setting up ejs
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

//Set up static files
app.use(express.static(path.join(__dirname,"public")));

//Setting reading of request bodies
app.use(express.urlencoded({extended:true}));

//Reading of more http verbs
app.use(methodOverride("_method"));

//Using Ejs-mate
app.engine("ejs",ejsMate);




//connection with mongoose database
async function main(){
    await mongoose.connect(dbUrl);
}

main()
.then((res)=>{
    console.log("Connection to database was successful");
})
.catch((err)=>{
    console.log("Some error in connection");
});







//Setting connect-flash middleware
app.use(flash());
//Setting express-session middleware
app.use(session(sessionOptions));


//Passport configurations
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//To use static authenticate model of our strategy
passport.serializeUser(User.serializeUser());// Takes full user object and decides what needs to be stored in session
passport.deserializeUser(User.deserializeUser());// takes session ID and fetches the full user stored through (ie,using what) what is stored by serialize

//Using connect-flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});




// app.get("/demouser", async (req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"student"
//     });
//     let registeredUser=await User.register(fakeUser,"secret");
//     res.send(registeredUser);
// });


//Using Express Routers..this calls all the routes to go to lisitng.js
app.use("/listings",listingRouter);

//This would call all the review related routes
app.use("/listings/:id/reviews",reviewRouter);

//all requets related to user
app.use("/",userRouter);




//Error handling middleware

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    
    res.status(status).render("error.ejs",{message});
    
});