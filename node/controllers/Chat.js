
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
                    return next(new Error("Authentication error!"))
                }
                socket.user = decoded;
                next();
            });
        } else {
            console.log("There is no token");
        }
        
    })
      io.on('connection', (socket) => {
          console.log("New client connected");
          console.log(socket.user)
        
          socket.on('sendMessage', (message) => {
              io.emit('receiveMessage', message);
              console.log(message)
          })
          socket.on('disconnect', () => {
              console.log('Client disconnected')
          })
      });
    return io;
}
module.exports = mountIoListener;