const User = require('../models/User')
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2


const signup = async function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const entry = await User.find({ email: email })
  if (entry.length>0) {
    res.send({ succes: false, message: "user is present already", data: '' })
  }
  else {
    const user = await User.findOne({name:name})
    if(user){
      res.send({succes:false ,message:"user name is exist already please change your name"})
    }
else{
    let saltroud = 10;
    let newpassword = await bycrypt.hash(password, saltroud)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
      if (req.file) {
        const upload = await cloudinary.uploader.upload(req.file.path)  //image ko clondinary me ulpdad krna 
        // (upload.public_id, 'upload.publicId');

        await User.create({
          name: name,
          email: email,
          password: newpassword,
          ProfileDetail: {
            profilePhoto: upload.secure_url,
            publicId: upload.public_id
          }
        })
      }
      else {
        await User.create({
          name: name,
          email: email,
          password: newpassword,
          ProfileDetail: {
            profilePhoto: null,
            publicId: null
          }
        })

      }

      let token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '5m' })
      res.send({ succes: true, message: "user created succesfully", token: token })
    }
    catch (err) {
      console.log(err);

    }
  }
}

}
const login = async (req, res) => {
  
  

  const email = req.body.email;
  const password = req.body.password;
 
  
  const user = await User.findOne({ email: email })
  
  if (!user) {
    res.send({ succes: false, message: "email or password is not correct" })
  }
  else {

    bycrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
          expiresIn: '5m' // Token expires in 5 min


        });
        res.send({ succes: true, message: "Login succesfully", data: user, token: token })
      }
      else {
        res.send({ succes: false, message: "email or password is not correct" })
      }
    })
  }
}
// Middleware to verify the token
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      // Check if the error is due to token expiration
      if (err.name === 'TokenExpiredError') {
        // Redirect or handle expired token case
        return res.status(401).json({ message: 'Session expired, please log in again' });
      }
      return res.status(401).json({ message: 'Invalid Token' });
    }
    // Token is valid, add user info from decoded token to the request object
    req.user = decoded;
    next();
  });
};

async function allUsers(req, res) {

  let users = await User.find({});
  res.send({ succes: true, message: 'all users sent', users: users })
}

async function getUserName(req, res) {
  try {

    let id = req.params.id;
    let user = await User.findOne({ _id: id });
    res.send({ success: true, data: user });
  } catch (err) {
    res.send({ success: false });
  }

}
async function editUser(req, res) {

  try {

    let id = req.params.id;
    let name = req.body.name;
    let email = req.body.email;

    let user = await User.findOne({ _id: id })

    if (req.file) {
      const newImagePath = req.file.path;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      if (user.ProfileDetail.publicId) {

        // // Replace the old image by using the same public ID
        const result = await cloudinary.uploader.upload(newImagePath, {
          public_id: user.ProfileDetail.publicId, // Replace 'sample' with the public ID of the existing image
          overwrite: true,     // Ensure the old file is overwritten
        })
        // ('Image successfully replaced:', result.secure_url);
        user.ProfileDetail.profilePhoto = result.secure_url;
      }
      else {

        const upload = await cloudinary.uploader.upload(newImagePath);
        user.ProfileDetail.publicId = upload.public_id;
        user.ProfileDetail.profilePhoto = upload.secure_url
        //  ("image upload done");

      }
    }
    user.name = name;
    user.email = email;
    let u = await user.save()
    res.send({ succes: true, data: u })
  } catch (err) {
    console.log(err);
  }

}

module.exports = {
  signup, login, verifyToken, allUsers, getUserName, editUser
}






