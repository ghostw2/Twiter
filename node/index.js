const express = require("express")
const cors = require("cors");
const mongoose = require("mongoose")
const db = require("./db/db-conection");

require('dotenv').config();
db.connectDb();

const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:8085'],
  optionsSuccessStatus: 200,
  credentials:true
}

const passport = require("passport")
const session = require("express-session")

const UserRouter = require("./routes/userRouter")
const ChatRouter = require("./routes/chatRouter")
const User = require("./models/user")

console.log("app started in " + process.env.NODE_ENV);

const http = require('http')
const app = express();
const server = http.createServer(app);
const mountIoListener = require("./socketControllers/ChatSocketController")

const io = mountIoListener(server)

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', req.headers.origin); // Dynamically allow the requested origin
  // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  // res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Respond to preflight request
  }
  next();
});
app.use(session({ secret: "my_secret_key", resave: false, saveUninitialized: false }))


app.use(passport.initialize());
app.use(passport.session());

app.use("/", UserRouter);
app.use('/chat', ChatRouter);

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'my_secret_key_123',
};
 
passport.use(new JwtStrategy(jwtOptions, function (jwtPayload, done) {
  console.log(jwtPayload)
  User.findById(jwtPayload.id).then(user => { 
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }).catch(err => { 
    return done(err, false);
  })
  
}));


app.use("/protected", passport.authenticate("jwt", { session: false }), (req,res) => {
  res.json({
    success: true,
    message:"this is the the jwt middleware"
  });
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Catch-all middleware for unmatched routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
