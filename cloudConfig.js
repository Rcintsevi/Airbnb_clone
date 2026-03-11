const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Airbnb_DEV',//To set up name of folder
    allowedFormats:["png","jpeg","jpg"],
    public_id: (req, file) => `listing_${Date.now()}`,
  },
});

module.exports={cloudinary,storage};