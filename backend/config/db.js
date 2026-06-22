const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose.
// Called once from server.js.
async function connectDB(mongoUri) {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };

