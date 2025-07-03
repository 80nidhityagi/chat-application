const express = require('express');
const router = express.Router();
const usercontroller = require('../controller/usercontroller')
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files


router.get('/getUserName/:id', (req, res) => {
    usercontroller.getUserName(req, res);
})

router.post('/signup', upload.single("image"), (req, res) => {
    usercontroller.signup(req, res)
})
router.post('/login', (req, res) => {
    console.log("inside login route");
    
    usercontroller.login(req, res);
})



router.post('/editUser/:id', upload.single("profile"), (req, res) => {
    usercontroller.editUser(req, res);


})

const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {

    const SECRET_KEY = process.env.SECRET_KEY;
    const token = req.headers['authorization'];
    //     const decoded = jwt.decode(token);
    // const currentTime = Math.floor(Date.now() / 1000);
    // ("Client Current Time:", currentTime);
    // ("Token Issued At (iat):", decoded.iat);
    // ("Token Expiration Time (exp):", decoded.exp);
    // (decoded.exp-currentTime);
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            ("Error in verifying token", err);

            // Check if the error is due to token expiration
            if (err.name === 'TokenExpiredError') {

                return res.status(401).json({ message: 'Session expired, please log in again' });
            }
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Token is valid, attach user information to req.user
        req.user = decoded; // Ensure decoded contains the user data
        next();
    });
}


// Example protected route
router.get('/user/profile', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to your profile', user: req.user });
});


router.get('/allUsers', (req, res) => {


    usercontroller.allUsers(req, res);
})



module.exports = router;
