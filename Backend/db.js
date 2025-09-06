const mongoose = require('mongoose');

// Replace 'your_mongodb_uri' with your actual MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/test-db';

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
