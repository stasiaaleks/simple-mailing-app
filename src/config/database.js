const { MongoClient } = require('mongodb');
const CONFIG = require('../constants/config');

let dbInstance = null;

const connectDB = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const client = new MongoClient(CONFIG.MONGODB_URI);
    await client.connect();
    dbInstance = client.db();
    console.log('Connected to MongoDB');
    return dbInstance;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!dbInstance) {
    throw new Error(CONFIG.ERRORS.DB_NOT_INITIALIZED);
  }
  return dbInstance;
};

module.exports = {
  connectDB,
  getDB
};
