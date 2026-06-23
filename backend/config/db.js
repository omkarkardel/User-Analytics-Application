const mongoose = require('mongoose');

async function connectDB(mongoUri) {
  try {
    mongoose.set('strictQuery', true);

    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    throw err;
  }
}

module.exports = { connectDB };