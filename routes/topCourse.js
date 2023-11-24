const express = require('express');
const router = express.Router();
const {handleAddTopCourse,handleUpdateTopCourse ,handleDeleteTopcourse} = require("../controllers/topCourse");

router.post('/',handleAddTopCourse)
      .patch('/:id',handleUpdateTopCourse)
      .delete('/delete/:id',handleDeleteTopcourse);

module.exports = router;