
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Chat = require('../models/Chat');
const ChatMessage = require("../models/ChatMessage");
require('dotenv').config();
const loadChats = async (id) => {
    try { 
        const chats = await Chat.find({ recivers: id });
        return chats;
    }catch (e) {
        console.log(e.message)
     }
}

const mountIoListener = (server) => {
   
    const io = new Server(server, {
        cors: {
          origin: ['http://localhost:5173', 'http://localhost:8085'],
          methods: ['GET', 'POST'],
          credentials: true},
        transports: ['websocket', 'polling']
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth.token
        console.log(token);
        if (token) {
            jwt.verify(token.split(" ")[1], process.env.BACK_END_SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.log("There is an error in the token verification "+ err.message)
                    socket.disconnect();
                }
                console.log(decoded)
                socket.user = decoded;
                socket.join(decoded.id)
                console.log(`user with id :${decoded.id} just connected to the chat `)
                next();
            });
        } else {
            console.log("There is no token");
        }
        
    })
    io.on('connection', (socket) => {
          io.emit('chatsLoaded',loadChats(socket.user.id))
          console.log("New client connected");
          console.log(socket.user)
        
          socket.on('sendMessage', async (message) => {
              const chatId = message.chat_id;
              if (chatId) {
                  const chat = await Chat.findById(chatId)
              }
              else {
                  const chat = new Chat({
                      recivers: [message.sender]
                  });
                  await chat.save();
                  const message = new ChatMessage({
                    chat_id: message.chat_id,
                    sender: message.sender,
                    text: message.text,
                    createdAt: new Date(),
                  });
                   await ChatMessage.save()
              }
              io.emit('receiveMessage', message);
              console.log(message)
          })
          socket.on('selectChat', async (data) => {
              const chatId = data.chat_id;
              const chat = null;
              const chatMessages = [];
            if (chatId) {
                chat = await Chat.findById(chatId)
                chatMessages = await ChatMessage.find({chat:chatId})
            }
            else {
                chat = new Chat({
                    createdaAt: Date.now()
                })
                await chat.save();
            }
              socket.emit('chatSelected', { chat_id: chat.id, messages: [chatMessages]})
          })
          socket.on('disconnect', () => {
              console.log('Client disconnected')
          })
      });
    return io;
    
    
}
module.exports = mountIoListener;