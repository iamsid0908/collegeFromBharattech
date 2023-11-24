const mongoose = require("mongoose");
const ImageSchema = new mongoose.Schema({
  filename: 
  { 
    type: String,
     required: true
     },
  contentType: {
     type: String,
      required: true 
    },
    name:{
      type: String
    }
});

// Create the Mongoose model for the image.
const ImageModel = mongoose.model("Image", ImageSchema);
module.exports = ImageModel;