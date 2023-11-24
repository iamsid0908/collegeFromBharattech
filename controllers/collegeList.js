const collegelistModel = require("../models/collegelistschema.js");
const { connectToMongo } = require("../db/config.js");
const { ObjectId } = require("mongodb");

let db;

connectToMongo((err, database) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }
  db = database;
});

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "../uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.home = async (req, res, next) => {
  return res.render("homepage");
};

exports.addCollegeList = upload.single("profileImage");

exports.postAddCollegeList = async (req, res, next) => {
  const collegeList = db.collection("collegelist");
  let filename = req.body.filename;
  let contentType = req.body.contentType;
  if (!filename || !contentType) {
    filename = "1689399542959-1.jpg";
    contentType = "image/jpeg";
  }

  const list = new collegelistModel({
    filename: filename,
    contentType: contentType,
    CollegeName: req.body.CollegeName,
    FullForm: req.body.FullForm,
    placeName: req.body.placeName,
    ApprovalOrg: req.body.ApprovalOrg,
    Admissions: req.body.Admissions,
    Placements: req.body.Placements,
    CourseName: req.body.CourseName,
    Fees: req.body.Fees,
    Rating: req.body.Rating,
    Brochure: req.body.Brochure,
    Enquire: req.body.Enquire,

  });

  try {
    await collegeList.insertOne(list);
    return res.status(200).json({ list });
  } catch (err) {
    return res.status(500).json({ message: "error" });
  }
};




exports.postmanyCollegeList = async (req, res, next) => {
  try {
    // we have to insert an array of objects as an input from user side
    const colleges = req.body; 

    if (!Array.isArray(colleges)) {
      return res.status(400).send("Invalid request format. Expecting an array.");
    }
    for(let i=0;i<colleges.length;i++){
      if(colleges[i].filename == "") colleges[i].filename="1689399542959-1.jpg";
      if(colleges[i].contentType == "") colleges[i].contentType="image/jpeg";
    }

    // Insert the documents
    const collegeList = db.collection("collegelist");
    const result = await collegeList.insertMany(colleges);
    console.log("Success", result);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error occurred while adding up many colleges list");
  }
};



exports.updateCollegelist = async (req, res) => {
  try {
    // Validate input
    // const { id, ...updateData } = req.body;
    const id = req.body.id;
    if(!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Update the document
    const updatedcollegeList = db.collection("collegelist");
    const result = await updatedcollegeList.updateOne(
      { _id: ObjectId(id) },
      {
        $set: req.body,
      }
    );

    // Check if the update was successful
    
    if(result.matchedCount == 0) {
       return res.status(200).json({success: true})
    }
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "College not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating college:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



exports.deleteCollegeList = async(req,res)=>{
     
  try{
    const id = req.body.id;
    if(!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const deletedcollegeList = db.collection("collegelist");
    await deletedcollegeList.deleteOne( { _id: ObjectId(id) } );
    return res.status(200).json({ success: true });

  }
  catch(err){
    console.log(err);
    res.send("Server Error");
  }

}

