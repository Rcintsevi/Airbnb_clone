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

//Server side schema validation using joi
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }

};

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};

//Index Route(Only shows title)
app.get("/listings",wrapAsync(async (req,res,next)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
}));

//New route (have this before show route or else new would be treated as :id)
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
    
});

//Create Route
app.post("/listings",validateListing,wrapAsync( async (req,res,next)=>{
    
    //new method
    let listing=req.body.listing;
    
    const newListing=new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
}));


//Show route
app.get("/listings/:id",wrapAsync(async (req,res,next)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id).populate("reviews");


    res.render("listings/show.ejs",{listing});
}));

//Update route
//Serving the form
app.get("/listings/:id/edit",validateListing,wrapAsync(async (req,res,next)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

}));

app.patch("/listings/:id",wrapAsync(async (req,res,next)=>{
    let id=req.params.id;
     if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let newListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Destroy Route
app.delete("/listings/:id",wrapAsync(async (req,res,next)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));



//Adding reviews
//Serving the post route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("Review was saved");
    res.redirect(`/listings/${listing._id}`);


}));
//Delete route for reviews
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);

}));


//Error handling middleware

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    
    res.status(status).render("error.ejs",{message});
    
});