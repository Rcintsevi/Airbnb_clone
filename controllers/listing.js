const Listing=require("../models/listing.js");
const geocodeLocation=require("../utils/geocode.js");


module.exports.index=async (req,res,next)=>{
    if(!req.query.type){
        let allListings= await Listing.find({});
        return res.render("listings/index.ejs",{allListings});
    }
    else{
        let filterType=req.query.type;
        let allListings=await Listing.find({listing_type:filterType});
        return res.render("listings/index.ejs",{allListings});
    }
    
    
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
    const location=listing.location;
    const coords = await geocodeLocation(location);
    


    res.render("listings/show.ejs",{listing,lat:coords.lat,lng:coords.lng});
}

module.exports.editForm=async (req,res,next)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);
    let originalImageURL=listing.image.url;
    originalImageURL=originalImageURL.replace("/upload","/upload/w_250,h_300");

    res.render("listings/edit.ejs",{listing,originalImageURL});

}

module.exports.editListing=async (req,res,next)=>{
    let id=req.params.id;
     if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let newListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(req.file){
        let url=req.file.path;
        let filename=req.file.filename;
        newListing.image={url,filename};
        newListing.save();
    }


    const location=newListing.location;
    const coords = await geocodeLocation(location);
    newListing.geometry = {
    type: "Point",
    coordinates: [
      parseFloat(coords.lng), 
      parseFloat(coords.lat)  
    ]
  };
    newListing.save();
    
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
    
    let url=req.file.path;
    let filename=req.file.filename;
    //new method
    let listing=req.body.listing;
    

    
    const newListing=new Listing(listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    const location=listing.location;
    const coords = await geocodeLocation(location);
    
    newListing.geometry = {
    type: "Point",
    coordinates: [
      parseFloat(coords.lng), 
      parseFloat(coords.lat)  
    ]
  };
    req.flash("success","New Listing created!");
    await newListing.save();
    res.redirect("/listings");
}