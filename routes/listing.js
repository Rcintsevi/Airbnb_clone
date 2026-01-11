const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");


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

//Index Route(Only shows title)
router.get("/",wrapAsync(async (req,res,next)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
}));

//New route (have this before show route or else new would be treated as :id)
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
    
});

//Create Route
router.post("/",validateListing,wrapAsync( async (req,res,next)=>{
    
    //new method
    let listing=req.body.listing;
    
    const newListing=new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
}));


//Show route
router.get("/:id",wrapAsync(async (req,res,next)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id).populate("reviews");


    res.render("listings/show.ejs",{listing});
}));

//Update route
//Serving the form
router.get("/:id/edit",validateListing,wrapAsync(async (req,res,next)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

}));

router.patch("/:id",wrapAsync(async (req,res,next)=>{
    let id=req.params.id;
     if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let newListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Destroy Route
router.delete("/:id",wrapAsync(async (req,res,next)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports=router;
