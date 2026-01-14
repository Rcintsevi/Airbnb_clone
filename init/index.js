//This file is created for the sole purpose of adding the data to our MongoDB 
const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


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



//To clean databse
let initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'69654958f2421acec3464c14'}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialsed");

}
initDB();