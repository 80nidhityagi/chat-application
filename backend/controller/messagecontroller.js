const User = require('../models/User')
const Chat = require('../models/Chat')
const Message = require('../models/Message');

async function getmessages(req, res) {
    try {

        let sender_id = req.params.sender_id;
        let chat_id = req.params.chat_id;


        // Find all messages for the given chat
        const oldmessages = await Message.find({ chatId: chat_id }).sort({ createdAt: 1 }); // Sorted by oldest to newest



        //   (oldmessages,'oldmessseges');
        res.status(200).send({ success: true, data: oldmessages });
    } catch (err) {
        res.status(400).send({ success: false });
    }



}
async function inputmessage(req, res) {

    try {

        let chat_id = req.body.chat_id;
        let sender_id = req.body.senderId;
        let receiver_id = req.body.chat_id;
        let content = req.body.content;
        let d = req.body.createdAt;

        let chat = await Chat.findById({ _id: chat_id });


        let senderName = null;
        if (chat.isGroupChat) {
            let u = await User.findOne({ _id: sender_id });
            senderName = u.name;
        }
        let newobj = {
            senderId: sender_id,
            senderName,
            chatId: receiver_id,
            content: content,
            createdAt: d
        }
        await Message.create(newobj);

        let m = await Message.find({})
        // (m);


        res.send({ succes: true });
    } catch (err) {
        console.log(err);

    }



}


module.exports = {
    getmessages, inputmessage
}