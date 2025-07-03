const User = require('../models/User')
const Chat = require('../models/Chat')

async function getChatValeUser(req, res) {
    const userid = req.params.userid;

    try {
        // Fetch all chats where the user is part of the `user` array
        const chats = await Chat.find({ user: userid })
            .populate('user', 'name') // Populate user names
        // Populate group name for group chats (if applicable)
        //chatusers array bnane se phele
        let chatusers = [];
        // ('chats',chats);


        // Process each chat
        chats.forEach(chat => {
            if (chat.isGroupChat) {
                // For group chats, add the group name

                chatusers.push({ type: 'group', name: chat.groupName, chat_id: chat._id });
            } else {
                // For one-to-one chats, find the other user's name
                const otherUser = chat.user.find(u => u._id.toString() !== userid);
                if (otherUser) {
                    chatusers.push({ type: 'user', name: otherUser.name, chat_id: chat._id });
                }
            }
        });



        res.send({ success: true, data: chatusers });
    } catch (error) {
        console.error("Error fetching chat data:", error);
        res.status(500).send({ success: false, message: "Error fetching chat data" });
    }
}

async function saveSimpleChat(req, res) {

    let sender_id = req.body.sender;
    let receiver_id = req.body.receiver;

    let sortedUsers = [sender_id, receiver_id].sort();


    // Find the chat object with the sorted user array
    let data = await Chat.findOne({
        // isgroupChat: false,
        user: { $all: sortedUsers }
    });


    if (!data) {

        let obj = {
            isgroupChat: false,
            user: sortedUsers,
        };
        await Chat.create(obj);
        let data = await Chat.findOne({
            // isgroupChat: false,
            user: { $all: sortedUsers }
        });

        res.send({ success: true, message: 'userchat', data: data._id });
    }
    else {
        res.send({ success: true, data: data._id })
    }

}



async function saveGroupChatUser(req, res) {
    let groupName = req.body.groupName;
    let users = req.body.users;
    let adminId = req.body.adminId;

    let data = {
        groupName: groupName,
        isGroupChat: true,
        user: users,

        adminId: adminId

    }
    let d = await Chat.create(data);
    res.status(200).json({ success: true, data: d });
}

async function getGroupChatUser(req, res) {


}

module.exports = {

    getChatValeUser, saveSimpleChat, saveGroupChatUser, getGroupChatUser
}