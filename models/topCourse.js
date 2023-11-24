const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    course: {
      type: String,
      required: true,
    },
   
    collegeName: {
      type: String,
      require: true,
    },
    branch: {
      type: String,
      required: true,
    },
    courseDuration: {
      type: Number,
      required: true,
    },
   rating:{
    type: Number,
    required: true,
    min: 1,
    max: 5,
   },
   job_role:[String],
    
  });
  
  const courseModel = mongoose.model("topCourses", courseSchema);
  module.exports = courseModel;
  