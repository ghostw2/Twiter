const { response } = require("express");
const Chat = require("../models/Chat")
const ChatMessage = require("../models/ChatMessage");

module.exports.loadByUser = async (req,res,next) => {
    try { 
        
        const  user_id  = req.query.user_id;
      //  if (chat_id !== null) chats = await Chat.find({ id: chat_id });
        const chats = await Chat.find(
            {
                recivers: {
                    $in : [user_id]
                }
            }
        ).populate('recivers');
        return res.status(200).json({
            chats
        })
    } catch (e) {
        return res.status(400).json({
            message:e.message
        })
     }
}
module.exports.createChat = async (req, res, nex) => {
    
    try {
        const { recivers } = req.body;
        const chat = new Chat({
            recivers: recivers
        });
        chat.save();
        return res.status(201).json({
            error: false,
            chat:chat
        });
    } catch (e) {
        return res.status(500).json({
            error:e.message
        })
    }
}
module.exports.loadChatMessages = async (req,res,next) => {
    try {
        const messages = await ChatMessage.find({ chat_id: req.query.id });
        return res.status(200).json({
            messages
        }); 
    } catch (e) {
        return res.status(400).json({
            message:e.message
        })
    }
    
}