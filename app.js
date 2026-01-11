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
const listing=require("./routes/listing.js");
const review=require("./routes/review.js");





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
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main()
.then((res)=>{
    console.log("Connection to database was successful");
})
.catch((err)=>{
    console.log("Some error in connection");
});

app.get("/",(req,res)=>{
    res.send("Home page");
});





//Using Express Routers..this calls all the routes to go to lisitng.js
app.use("/listings",listing);

//This would call all the review related routes
app.use("/listings/:id/reviews",review);


//Error handling middleware

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    
    res.status(status).render("error.ejs",{message});
    
});