const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL;

async function dbConnect() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB:", DB_URL);
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error.message);
  }
}

module.exports = dbConnect;
