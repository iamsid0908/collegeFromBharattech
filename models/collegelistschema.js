const mongoose = require("mongoose");
const collegelistSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: false,
  },
  contentType: {
    type: String,
    required: false,
  },
  CollegeName: {
    type: String,
    require: true,
    unique: true,
  },
  FullForm: {
    type: String,
    required: false,
  },
  placeName: {
    type: String,
    required: true,
  },
  ApprovalOrg: {
    type: String,
    required: false,
  },
  Admissions: {
    type: Number,
    required: false,
  },
  Placements: {
    type: String,
    required: false,
  },
  // here add to compare
  CourseName: {
    type: String,
    required: false,
  },
  Fees: {
    type: Number,
    required: false,
  },
  Rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  Brochure: {
    type: String,
    required: false,
  },
  Enquire: {
    type: String,
    required: false,
  },
});

const collegelistModel = mongoose.model("collegelist", collegelistSchema);
module.exports = collegelistModel;
