const { ObjectId } = require("mongodb");
const { connectToMongo} = require("../db/config.js");
const topCourse = require('../models/topCourse');



//  Connection to mongodb

let db;

connectToMongo((err, database) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    db = database;

});

// create or add data into database

async function handleAddTopCourse(req,res){
    const tCourse = db.collection('topCourses');
    const courseList = req.body;
    const list = new topCourse({
       course : courseList.course,
       collegeName : courseList.collegeName,
       branch : courseList.branch,
       rating : courseList.rating,
       courseDuration : courseList.courseDuration,
       job_role : req.body.job_role,
     });
     try {
        await tCourse.insertOne(list);
        return res.status(200).json({ list });
    } catch (err) {
        return res.status(500).json({ message: "error" });
    }
}

//Update Function

async function handleUpdateTopCourse(req,res){
    try {
    
        const id = req.params.id;
        
        // Update the document
        const updateTopCourses = db.collection("topCourses");
        const result = await updateTopCourses.updateOne(
          { _id: ObjectId(id) },
          {
            $set: req.body,
          }
        );
    
        // Check if the update was successful
        console.log(result);
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "College not found" });
        }
    
        return res.status(200).json({ success: true });
      } 
      catch (error) {
        console.error("Error updating :", error);
        return res.status(500).json({ error: "Internal server error" });
      }
}

// delete function

async function handleDeleteTopcourse(req,res){
    try{
        const id = req.params.id;
        const delTopcourse = db.collection('topCourses');
        let result= await delTopcourse.deleteOne({_id:ObjectId(id)});
        
        // Check if the delete was successful
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "College not found" });
        }
    
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Error updating :", error);
        return res.status(500).json({ error: "Internal server error" });
      }
}


module.exports = {
    handleAddTopCourse,
    handleUpdateTopCourse,
    handleDeleteTopcourse,
}