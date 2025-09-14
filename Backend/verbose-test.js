const mongoose = require('mongoose');

console.log('🔍 Starting MongoDB connection test...');
console.log('📅 Current time:', new Date().toISOString());

// Set up connection event listeners
mongoose.connection.on('connecting', () => {
    console.log('🔄 Connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📊 Database name:', mongoose.connection.db.databaseName);
    console.log('🔗 Connection state:', mongoose.connection.readyState);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
});

mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Disconnected from MongoDB');
});

// Set a timeout to prevent hanging
const timeout = setTimeout(() => {
    console.log('⏰ Connection timeout after 10 seconds');
    process.exit(1);
}, 10000);

// Attempt connection
mongoose.connect('mongodb://localhost:27017/test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
})
.then(() => {
    clearTimeout(timeout);
    console.log('🎉 Connection successful!');
    
    // Test a simple operation
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    return TestModel.create({ test: 'connection test' });
})
.then(() => {
    console.log('✅ Database write test successful!');
    return mongoose.connection.close();
})
.then(() => {
    console.log('🔌 Connection closed successfully!');
    process.exit(0);
})
.catch((error) => {
    clearTimeout(timeout);
    console.error('❌ Test failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    process.exit(1);
});

