const scholarshipModel = require("../models/scholarshipSchema.js");
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

exports.home = async (req, res, next) => {
    return res.render("Scholarship homepage");
  };

exports.postAddscholarshipList = async (req, res, next) => {
  const scholarshipList = db.collection("scholarshiplist");
 
  const list = new scholarshipModel({
      
    InternationalStudentEligible: req.body.InternationalStudentEligible,
    Amount: req.body.Amount,
    Type: req.body.Type,
    LevelOfStudy: req.body.LevelOfStudy,
    NoOfScholarships: req.body.NoOfScholarships,
     
  });

  try {
    await scholarshipList.insertOne(list);
    return res.status(200).json({ list });
  } catch (err) {
    return res.status(500).json({ message: "error" });
  }
};


exports.postmanyscholarshipList = async (req, res, next) => {
  try {
    // we have to insert an array of objects as an input from user side
    const scholarships = req.body; 

    if (!Array.isArray(scholarships)) {
      return res.status(400).send("Invalid request format. Expecting an array.");
    }
    // Insert the documents
    const scholarshipList = db.collection("scholarshiplist");
    const result = await scholarshipList.insertMany(scholarships);
    console.log("Success", result);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error occurred while adding up many scholarships list");
  }
};


exports.updatescholarshiplist = async (req, res) => {
  try {
    // Validate input
    // const { id, ...updateData } = req.body;
    const id = req.body.id;
    if(!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Update the document
    const updatedscholarshipList = db.collection("scholarshiplist");
    const result = await updatedscholarshipList.updateOne(
      { _id: ObjectId(id) },
      {
        $set: req.body,
      }
    );

    // Check if the update was successful
    if(result.matchedCount === 0) {
      return res.status(200).json({success: true})
   }

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "scholarship not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating scholarship:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};







exports.deletescholarshipList = async(req,res)=>{
     
  try{
    const id = req.body.id;
    if(!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const deletedscholarshipList = db.collection("scholarshiplist");
    await deletedscholarshipList.deleteOne( { _id: ObjectId(id) } );
    return res.status(200).json({ success: true });

  }
  catch(err){
    console.log(err);
    res.send("Server Error");
  }

}

