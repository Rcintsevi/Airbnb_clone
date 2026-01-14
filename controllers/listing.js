const Listing=require("../models/listing.js");


module.exports.index=async (req,res,next)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
}

module.exports.newForm=(req,res)=>{
    res.render("listings/new.ejs");
    
}

module.exports.showListing=async (req,res,next)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","The listing does not exists");
        return res.redirect("/listings");
    }
    // console.log(listing);
    // console.log(req.user);


    res.render("listings/show.ejs",{listing});
}

module.exports.editForm=async (req,res,next)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

}

module.exports.editListing=async (req,res,next)=>{
    let id=req.params.id;
     if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let newListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated");
    
    res.redirect(`/listings/${id}`);
}

module.exports.destroy=async (req,res,next)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Lisitng deleted");
    res.redirect("/listings");
}

module.exports.createListing=async (req,res,next)=>{
    
    //new method
    let listing=req.body.listing;
    
    const newListing=new Listing(listing);
    newListing.owner=req.user._id;
    req.flash("success","New Listing created!");
    await newListing.save();
    res.redirect("/listings");
}