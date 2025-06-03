const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ تم الاتصال بقاعدة البيانات MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ خطأ أثناء الاتصال بقاعدة البيانات: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
