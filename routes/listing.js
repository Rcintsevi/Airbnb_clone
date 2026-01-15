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
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});
const {geocodeLocation}=require("../utils/geocode.js");



//To get more modularity we use router.route()
//It will combine similar paths with different verbs


router.route("/")
.get(wrapAsync(listingController.index))//Index route
.post(isLoggedIn,validateListing,upload.single("listing[image]"),wrapAsync(listingController.createListing))//Create route
;

//New route (have this before show route or else new would be treated as :id)
router.get("/new",isLoggedIn,listingController.newForm);



router.route("/:id")
.get(wrapAsync(listingController.showListing))//Show route
.patch(isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.editListing))//Update route
.delete(isLoggedIn,wrapAsync(listingController.destroy))//Delete route
;








//Update route
//Serving the form
router.get("/:id/edit",isLoggedIn,validateListing,wrapAsync(listingController.editForm));



module.exports=router;
