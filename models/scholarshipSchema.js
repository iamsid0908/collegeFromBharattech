const mongoose = require("mongoose");

const scholarshiplistSchema = new mongoose.Schema({
 
  InternationalStudentEligible: {
    type: Boolean,
    required: false,
  },
  Amount: {
    // could be variable or specific
    type: String,
    required: false,
  },
  Type: {
    // College-Specific
    // Merit-Based
    // Company-Sponsored
    type: String,
    required: true,
  },
  LevelOfStudy: {
    // Bachelor
    // Master
    type: String,
    required: false,
  },
  NoOfScholarships: {
    // NA
    // number
    type: Number,
    required: false,
  },
  
});

const scholarshipModel = mongoose.model("scholarshiplist", scholarshiplistSchema);
module.exports = scholarshipModel;