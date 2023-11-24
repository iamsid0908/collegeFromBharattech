const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require("passport");
require("dotenv").config();
const express = require("express");


const userModel = require("./models/auth.js");
const { connectToMongo } = require("./db/config.js");
const { ObjectId } = require("mongodb")

let db;

connectToMongo((err, database) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }
  db = database;
});



const app = express();
app.use(express.json());
//for google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, callback) {
      try {
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({
          email: profile.emails[0].value,
        });
         console.log(user);
        if (user) {
          console.log("User already exists.");
        } else {
          const newUser = {
            username: profile.displayName,
            email: profile.emails[0].value,
            password: profile.id, 
            verification_token: accessToken,
            verified: true,
            accessLevel: "",
            isPending: true,
          };

          await userCollection.insertOne(newUser);
          console.log("New user registered.");
        }
        callback(null, profile); // Move this line outside the try block
      } catch (err) {
        console.error("Error:", err);
        callback(err, null);
      }
    }
  )
);

//for github authentication
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback"
},
async function (accessToken, refreshToken, profile, callback) {
    try {
      const userCollection = db.collection("users");

      const user = await userCollection.findOne({
        email: profile.emails[0].value,
      });
       console.log(user);
      if (user) {
        console.log("User already exists.");
      } else {
        const newUser = {
          username: profile.displayName,
          email: profile.emails[0].value,
          password: profile.id, 
          verification_token: accessToken,
          verified: true,
          accessLevel: "",
          isPending: true,
        };

        await userCollection.insertOne(newUser);
        console.log("New user registered.");
      }
      callback(null, profile); // Move this line outside the try block
    } catch (err) {
      console.error("Error:", err);
      callback(null,profile);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
