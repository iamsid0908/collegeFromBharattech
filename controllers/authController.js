const catchAsync = require('../utils/catchAsync');
const session = require('express-session');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const  {connectToMongo}  = require("../db/config.js");
const User = require("../models/auth.js");
dotenv.config({path:'./config.env'});


//  Connection to mongodb

let db;

connectToMongo((err, database) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    db = database;

});

//  Signup function
exports.signup = catchAsync (async (req,res,next) => {

    const users = db.collection('users');
    const existingUser = await users.findOne({ email: req.body.email });

    if(!existingUser) {
        const hashPass = await bcrypt.hash(req.body.password, 10);
        const verificationToken = uuid.v4().replace(/-/g, '');

        await users.insertOne({
               username: req.body.username,
               email: req.body.email,
               password: hashPass,
               verification_token: verificationToken,
               verified: false,
               accessLevel: req.body.accessLevel,
               isPending: true
        })
 
        // send verification email
        const message = `Hello ${req.body.username},

        Please click the following link to verify your email address:

        http://localhost:3001/auth/verify?token=${verificationToken}

        Best regards,
        The Team`;

        const transporter = nodemailer.createTransport({
               service: 'gmail',
               auth: {
               user: 'csuv1202@gmail.com',
               pass: 'gftvwsmfaywbmshz',
               },
        });

        const mailOptions = {
               from: 'csuv1202@gmail.com',
               to: req.body.email,
               subject: 'Verify Your Email Address',
               text: message,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
              console.error(err);
              res.send('Error sending verification email');
              return;
          }

          console.log(`Verification email sent to ${req.body.email}`);
          res.send('Verification email sent. Please check your email to verify your account.');

        });
    } 
    else{
        res.send('That email already exists!');
    }
});


//  Email varification for register
exports.verify = async(req,res,next) => {
     const users = db.collection('users');
     const verificationToken = req.query.token;
     const user = await users.findOne({ verification_token: verificationToken });

     if (user) {
     await users.updateOne({ verification_token: verificationToken }, { $set: { verified: true } });
     res.send('Email verification successful. You can now log in to your account.');
     } else {
     res.send('Verification failed. Please sign up again.');
     }
};



//  Varification of subadmin by admin
exports.verifySubadmin = catchAsync(async (req, res, next) => {
     const users = db.collection('users');
     const email = req.body.email;
     const user = await users.findOne({ email, accessLevel: 'subadmin', isPending: true });

     if(user){
          await users.updateOne({ email }, { $set: { isPending: false, verified: true } });
          res.send('Subadmin account verified successfully.');
     } 
     else{
          res.send('No pending subadmin account found with the provided email.');
     }
});


//  Reset password
exports.reset = async(req,res,next) => {

    const users = db.collection('users');
    const email = req.body.email;
    const user = await users.findOne({ email: email });
    if (!user) {
          res.send('That email does not exist');
          return;
    }

    const passwordResetToken = uuid.v4();
    await users.updateOne({ email: email }, { $set: { passwordResetToken: passwordResetToken } });
    const message = `Hello ${user.username},
    \n\nPlease click the following link to reset your password:
    \n\nhttp://localhost:3001/reset-password?token=${passwordResetToken}
    \n\nBest regards,\nThe Team`;

    const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
          user: 'csuv1202@gmail.com',
          pass: 'gftvwsmfaywbmshz'
          }
    });

    const mailOptions = {
          from: 'csuv1202@gmail.com',
          to: email,
          subject: 'Password Reset',
          text: message
    };
    transporter.sendMail(mailOptions, (error, info) => {
          if(error){
               console.log(error);
               res.send('Error: unable to send email');
          } 
          else{
               console.log('Email sent: ' + info.response);
               res.send('Password reset email sent. Please check your email to reset your password.');
          }
    });
};
  

//  Reset password token check
exports.resetPassword = async (req, res, next) => {
    try{
          const users = db.collection('users');
          const passwordResetToken = req.query.token;
          const user = await users.findOne({ passwordResetToken });
     
          if (!user) {
               return res.send('Invalid password reset token');
          }
     
          // Redirect to the update password route with the token as a query parameter
          return res.redirect(`/update-password?token=${passwordResetToken}`);
     } 
     catch(error) {
          console.log(error);
          return res.status(500).send('Internal server error');
    }
};
  
  

//  Updating new password 
exports.updatePassword = async (req, res, next) => {
    try {
          const users = db.collection('users');
          const passwordResetToken = req.body.token;
          const user = await users.findOne({ passwordResetToken });
     
          if (!user) {
          return res.send('Invalid token. Please request a new password reset.');
          }
     
          const hashpass = await bcrypt.hash(req.body.password, 10);
          await users.updateOne({ passwordResetToken }, { $set: { password: hashpass, passwordResetToken: null } });
     
          res.send('Password updated successfully.');
     } 
     catch (error) {
          console.log(error);
          return res.status(500).send('Internal server error');
    }
};