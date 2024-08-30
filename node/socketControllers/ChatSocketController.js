
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Chat = require('../models/Chat');
const ChatMessage = require("../models/ChatMessage");
const Websocket = require('ws');
const { authenticate } = require('passport');
const passport = require('passport');
const { parse } = require('dotenv');
const url  = require('node:url')

require('dotenv').config();
let clients = new Map();
function onSocketError(err) {
    console.error(err);
}
function validateToken(token) {
    if (token) {
        return  jwt.verify(token.split(" ")[1], process.env.BACK_END_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log(JSON.stringify({ message: "There is an error in the token verification " + err.message }))
                return false;
            } else {
                console.log(decoded,"inside validate token")
                return decoded;
            }
        })
    } 
}
const mountIoListener = (server) => {
    const wss = new Websocket.Server({ noServer: true })
   
    wss.on('connection', (ws,request,client) => {
        ws.on('error', console.error);
        console.log(client,"this is connnection")
       // ws.emit("message",)
        ws.on('message', async (message) => {
            
            //const decodedMessage = JSON.parse(message.toString())
            const msg = JSON.parse(message).message
            
            const chatId = msg.chat_id;
            const sender = msg.sender
            const text = msg.text;
            let createdMessage = null;
            if (chatId) {
                const chat = await Chat.findById(chatId);
                if (chat) {
                    const newMessage = new ChatMessage({
                        chat_id: chat.id,
                            sender: sender,
                            message: text,
                        createdAt: new Date()
                    })
                    createdMessage = await newMessage.save();
                }
            
                chat.recivers.forEach((reciver) => {
                    console.log(reciver)
                    const reciverWs = clients.get(reciver.toString()).ws;
                    //if (reciver.id !== sender) {
                        reciverWs.send(JSON.stringify(createdMessage))
                    //}
                });
            }
           

            
            //find chat 
            //insert message to db
            //broadcastmessage to users//
            console.log(`message recived ${message}`);
    
        })
        ws.on('close', () => {
            clients.delete(client.id)
            console.log('client disconnected')
            
        })

    })
    server.on('upgrade', function upgrade(request, socket, head) {
        socket.on('error', onSocketError)
        const parsedUrl = url.parse(request.url,true)
        const token = parsedUrl.query.token;
        const client = validateToken(token);
        if (client) {     
            socket.removeListener("error", onSocketError)
            wss.handleUpgrade(request, socket, head, function done(ws) {
                clients.set(client.id ,{ws:ws,clinet:client})
                wss.emit('connection',ws,request,client)
            })
        } else {
            console.log("error")
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
        }
        
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