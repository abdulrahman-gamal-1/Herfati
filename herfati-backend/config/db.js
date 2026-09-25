const mongoose = require('mongoose');

// Connects to MongoDB using the URI from environment variables.
// Called once when the server starts.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB متصل: ${conn.connection.host}`);
  } catch (err) {
    console.error(`فشل الاتصال بقاعدة البيانات: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
