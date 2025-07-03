const mongoose = require('mongoose')
require('dotenv').config();
const mongoUri = process.env.MONGO_URI;

 const connect = async()=>{
    try {
        await mongoose.connect(mongoUri);
        console.log("mongodb is connected");
    } catch (error) {
        console.log(error);
    }
 }
 
 module.exports = connect;
