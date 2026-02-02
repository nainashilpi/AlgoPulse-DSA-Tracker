const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Render/Production settings ke liye options add kiye hain
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, 
      autoIndex: true, 
    });

    console.log(`🚀 Neural Link Established: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Terminated: ${error.message}`);
    // Exit process with failure
    process.exit(1); 
  }
};

module.exports = connectDB;