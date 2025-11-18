require('dotenv').config({ path: '.env.local' });
const mongoose = require("mongoose");

async function testConnection() {
  try {
    console.log("MONGODB_URI:", process.env.MONGODB_URI); // <--- debug line
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to connect:");
    console.error(err);
    process.exit(1);
  }
}

testConnection();

