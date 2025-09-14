const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');

mongoose.connect('mongodb://localhost:27017/test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 second timeout
    connectTimeoutMS: 5000
})
.then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('Connection state:', mongoose.connection.readyState);
    process.exit(0);
})
.catch((error) => {
    console.error('❌ MongoDB connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    process.exit(1);
});

