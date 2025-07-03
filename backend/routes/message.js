const express = require('express');
const router = express.Router();

const messagecontroller = require('../controller/messagecontroller');
router.get('/getmessages/:sender_id/:chat_id',(req,res)=>{  
    messagecontroller.getmessages(req,res);
})
router.post('/inputmessege',(req,res)=>{  
    messagecontroller.inputmessage(req,res);
})

module.exports = router