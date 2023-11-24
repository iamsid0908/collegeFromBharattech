const express = require('express')
const authController = require('../controllers/authController')

const router = express.Router();

router.post('/signup', authController.signup)
    // .post('/login', authController.login)
    .get('/verify', authController.verify)
    .get('/reset-password',authController.resetPassword)
    .post('/update-password/',authController.updatePassword)
    .post('/verify-subadmin',authController.verifySubadmin)
    .post('/reset',authController.reset)


module.exports = router;