
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Chat = require('../models/Chat');
const ChatMessage = require("../models/ChatMessage");
const Websocket = require('ws');

require('dotenv').config();

const mountIoListener = (server) => {
    const wss = new Websocket.Server({server})
   
    wss.on('connection', (ws) => {
        console.log('client connected ')
        ws.on('message', (message) => {
            //const decodedMessage = JSON.parse(message.toString())

           // console.log(JSON.parse(message));
            const token = message.token
            console.log(token)
            if (token) {
                
            }
            console.log(`message recived ${message}`);
            ws.send(message)
        })
        ws.on('close', () => {
            console.log('client disconnected')
            
        })

    })
    
    // io.use((socket, next) => {
    //     const token = socket.handshake.auth.token
    //     console.log(token);
    //     if (token) {
    //         jwt.verify(token.split(" ")[1], process.env.BACK_END_SECRET_KEY, (err, decoded) => {
    //             if (err) {
    //                 console.log("There is an error in the token verification "+ err.message)
    //                 socket.disconnect();
    //             }
    //             //console.log(decoded)
    //             //socket.user = decoded;
    //            // socket.join(decoded.id)
    //             //console.log(`user with id :${decoded.id} just connected to the chat `)
    //             next();
    //         });
    //     } else {
    //         console.log("There is no token");
    //     }
        
    // })
    // io.on('connection', (socket) => {
    //     const token = socket.handshake.auth.token
    //     console.log(token);
    //     if (token) {
    //         jwt.verify(token.split(" ")[1], process.env.BACK_END_SECRET_KEY, (err, decoded) => {
    //             if (err) {
    //                 console.log("There is an error in the token verification " + err.message)
    //                 socket.disconnect();
    //             }
    //             //console.log(decoded)
              
    //             socket.join(decoded.id)
               
    //         });
    //     }
    //       socket.on('sendMessage', async (message) => {
    //           const chatId = message.chat_id;
    //           const sender = message.sender;
    //           const text = message.text;
    //           let createdMessage = null;
    //           if (chatId) {
    //               const chat = await Chat.findById(chatId)
    //               if (chat) {
    //                 const newMessage = new ChatMessage({
    //                     chat_id: chat.id,
    //                     sender: sender,
    //                     message: text,
    //                     createdAt: new Date()
    //                   });
    //                   createdMessage = await newMessage.save()
    //                 console.log( chat)
    //                   chat.recivers.forEach((user => {
    //                         io.to(user.toString()).emit('receiveMessage', createdMessage);
    //                         console.log(user)
    //                     }))
                        
    //                     console.log(sender);
    //               }

    //           }
              
              
    //       })
    //       socket.on('selectChat', async (data) => {
    //           const chatId = data.chat_id;
    //           const chat = null;
    //           const chatMessages = [];
    //         if (chatId) {
    //             chat = await Chat.findById(chatId)
    //             chatMessages = await ChatMessage.find({ chat: chatId })
    //             console.log("joined chat ",chatId)
    //         }
    //         else {
    //             chat = new Chat({
    //                 createdaAt: Date.now()
    //             })
    //             await chat.save();
    //         }
    //           socket.emit('chatSelected', { chat_id: chat.id, messages: [chatMessages]})
    //       })
    //       socket.on('disconnect', () => {
    //           console.log('Client disconnected')
    //       })
    //   });
    // return io;
    
    
}
module.exports = mountIoListener;