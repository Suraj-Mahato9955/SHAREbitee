const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    // Using an in-memory database so you don't need to install MongoDB locally!
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    const conn = await mongoose.connect(uri);
    console.log(`✅ Virtual MongoDB In-Memory Server Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
