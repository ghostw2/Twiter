const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const session = require("express-session")
const UserRouter = require("./routes/user")
const User = require("./models/user")

const mongoUser = process.env.DATABASE_USER;
const mongoPassword = process.env.DATABASE_PASSWORD;
const mongoHost = process.env.DATABASE_HOST;
const mongoDatabase = process.env.DATABASE_NAME;

const connectionString = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}`;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName:mongoDatabase
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

//

const app = express();
app.use(express.json());
app.use(session({secret:"my_secret_key",resave:false,saveUninitialized:false}))
app.use(passport.initialize());
app.use(passport.session());
app.use("/", UserRouter);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
