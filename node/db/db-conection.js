const mongoose = require("mongoose")
const mongoUser = process.env.DATABASE_USER;
const mongoPassword = process.env.DATABASE_PASSWORD;
const mongoHost = process.env.DATABASE_HOST;
const mongoDatabase = process.env.DATABASE_NAME;
const connectionString = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}`;



module.exports.connectDb = () => {
    mongoose.connect(connectionString, {
    dbName:mongoDatabase
  }).then(() => {
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
}