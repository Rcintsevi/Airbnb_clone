const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");


const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        set: (v)=>v===""?"https://unsplash.com/photos/sunlight-illuminates-dramatic-sandstone-cliffs-under-a-blue-sky-e02TiydyhY4?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink":v,
        default:"https://unsplash.com/photos/sunlight-illuminates-dramatic-sandstone-cliffs-under-a-blue-sky-e02TiydyhY4?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink"
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }]
    
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing.reviews.length){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;