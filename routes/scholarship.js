const express = require("express");
const app = express();

const scholarshipListController = require("../controllers/scholarship"); // Update the path to where scholarshipList.js is located.

// Set up your middleware, view engine, and other configurations...
const router = express.Router();

router
  .get("/", scholarshipListController.home)
  .post(
    "/addonescholarshiplist",
    scholarshipListController.postAddscholarshipList
  )
  .post("/addmanyscholarshiplist",scholarshipListController.postmanyscholarshipList)
  .put(
    "/updatescholarshiplist",
    scholarshipListController.updatescholarshiplist
  )
  .delete(
    "/deleteonescholarshipList",
    scholarshipListController.deletescholarshipList
  );

// Other routes and app configurations...
module.exports = router;
