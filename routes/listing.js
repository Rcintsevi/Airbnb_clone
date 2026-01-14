const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");




//Index Route(Only shows title)
router.get("/",wrapAsync(async (req,res,next)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
}));

//New route (have this before show route or else new would be treated as :id)
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
    
});

//Create Route
router.post("/",isLoggedIn,validateListing,wrapAsync( async (req,res,next)=>{
    
    //new method
    let listing=req.body.listing;
    
    const newListing=new Listing(listing);
    newListing.owner=req.user._id;
    req.flash("success","New Listing created!");
    await newListing.save();
    res.redirect("/listings");
}));


//Show route
router.get("/:id",wrapAsync(async (req,res,next)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","The listing does not exists");
        return res.redirect("/listings");
    }
    console.log(listing);
    console.log(req.user);


    res.render("listings/show.ejs",{listing});
}));

//Update route
//Serving the form
router.get("/:id/edit",isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

}));

router.patch("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res,next)=>{
    let id=req.params.id;
     if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let newListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated");
    
    res.redirect(`/listings/${id}`);
}));

//Destroy Route
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res,next)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Lisitng deleted");
    res.redirect("/listings");
}));

module.exports=router;
