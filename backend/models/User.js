const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {type: String,required:true},
    email: {type: String},
    password: {type: String},
    ProfileDetail:{type:{
        profilePhoto:{type:String},
        publicId:{type:String}
    }}
},{timestamps:true})

module.exports = mongoose.model('User',UserSchema)