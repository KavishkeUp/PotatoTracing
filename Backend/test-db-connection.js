const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log('🔄 Attempting to connect to MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/test-db');
        console.log('✅ MongoDB connection successful!');
        
        // Test if we can create a simple document
        const testSchema = new mongoose.Schema({ test: String });
        const TestModel = mongoose.model('Test', testSchema);
        
        const testDoc = new TestModel({ test: 'connection test' });
        await testDoc.save();
        console.log('✅ Database write test successful!');
        
        // Clean up test document
        await TestModel.deleteOne({ test: 'connection test' });
        console.log('✅ Database cleanup successful!');
        
        await mongoose.connection.close();
        console.log('🔌 Connection closed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();

