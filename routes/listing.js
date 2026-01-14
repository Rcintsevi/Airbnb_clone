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
const listingController=require("../controllers/listing.js");




//Index Route(Only shows title)
router.get("/",wrapAsync(listingController.index));

//New route (have this before show route or else new would be treated as :id)
router.get("/new",isLoggedIn,listingController.newForm);

//Create Route
router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));


//Show route
router.get("/:id",wrapAsync(listingController.showListing));

//Update route
//Serving the form
router.get("/:id/edit",isLoggedIn,validateListing,wrapAsync(listingController.editForm));

router.patch("/:id",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

//Destroy Route
router.delete("/:id",isLoggedIn,wrapAsync(listingController.destroy));

module.exports=router;
