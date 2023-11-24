const express = require("express");
const app = express();

const collegeListController = require("../controllers/collegeList"); // Update the path to where collegeList.js is located.

// Set up your middleware, view engine, and other configurations...
const router = express.Router();

router
  .get("/", collegeListController.home)
  .post(
    "/addonecollegelist",
    collegeListController.addCollegeList,
    collegeListController.postAddCollegeList
  )
  .post("/addmanycollegelist",collegeListController.addCollegeList,collegeListController.postmanyCollegeList)
  .put("/updateCollegelist", collegeListController.updateCollegelist)
  .delete("/deleteoneCollegeList", collegeListController.deleteCollegeList);

// Other routes and app configurations...
module.exports = router;
