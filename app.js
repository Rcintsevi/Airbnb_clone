const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");




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
    res.send("Standard GET response");
});

//Index Route(Only shows title)
app.get("/listings",async (req,res)=>{
    
    let allListings= await Listing.find({});
    
    res.render("listings/index.ejs",{allListings});
    
});

//New route (have this before show route or else new would be treated as :id)
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
    
});

//Create Route
app.post("/listings",async (req,res)=>{
    
    //new method
    let listing=req.body.listing;
    const newListing=new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
});


//Show route
app.get("/listings/:id",async (req,res)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);


    res.render("listings/show.ejs",{listing});
});

//Update route
//Serving the form
app.get("/listings/:id/edit",async (req,res)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

});

app.patch("/listings/:id",async (req,res)=>{
    let id=req.params.id;
    let newListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Destroy Route
app.delete("/listings/:id",async (req,res)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});