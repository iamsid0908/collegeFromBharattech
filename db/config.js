const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;

require("dotenv").config();
const mongoUrl = process.env.DB;
const dbName = 'collegedunia';
let db;


function connectToMongo(callback){
    MongoClient.connect(mongoUrl, (err, client) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        console.log('Connected to MongoDB');
        db = client.db(dbName);
        callback(null, db);
    });
}


mongoose.connection.on("error", (err) => {
  console.log("Connection failed");
});
mongoose.connection.on("connected", (connected) => {
  console.log("Connected with database ");
});

module.exports = {
    connectToMongo,
    db,
};