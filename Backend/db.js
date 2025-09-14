const mongoose = require('mongoose');

// Use environment variable for MongoDB URI, fallback to local for development
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test-db';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Connection Error:', error);
});

db.once('open', () => {
  console.log('Connected...');
});
