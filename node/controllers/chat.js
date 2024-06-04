const { response } = require("express");
const Chat = require("../models/Chat")
module.exports.loadById = async (req,res,nex) => {
    try { 
        
        const { chat_id } = req.body;
      //  if (chat_id !== null) chats = await Chat.find({ id: chat_id });
        const chats = await Chat.find({id:chat_id});
        console.log(chats)
        return res.status(200).json({
            chats
        })
    } catch (e) {

        console.log(e.message);
        return res.status(400).json({
            message:e.message
        })
     }
}