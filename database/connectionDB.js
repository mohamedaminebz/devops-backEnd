const mongoose = require("mongoose");
const DB_HOST = process.env.DB_HOST || "mongodb";
const DB_PORT = process.env.DB_PORT || "27017";
const DB_NAME = process.env.DB_NAME || "mbookings";
const DB_USER = process.env.DB_USER || "admin00";
const DB_PASSWORD = process.env.DB_PASSWORD || "admin00";

const DB_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

console.log("DB_URL", DB_URL)
const connectDB = () => {
  mongoose.set("strictQuery", false);


  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    })
    .then(() => {
      console.log(`Connected to MongoDB M-booking db...`);
    })
    .catch((error) => {
      console.error(`Error connecting to MongoDB: ${error}`);
    });
};
module.exports = connectDB;
