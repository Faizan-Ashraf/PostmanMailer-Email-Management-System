import mongoose from "mongoose";
const mongoDbURL = 'mongodb://localhost:27017/PostmanMailer';
mongoose.connect(mongoDbURL);

const db = mongoose.connection;

db.on('connected',()=>{console.log("Database Connected Successfully")});
db.on('error',()=>{console.log("There is an Error in Connecting Database")});
db.on('disconnected',()=>{console.log("Databse Disconnected")});

export default db;

