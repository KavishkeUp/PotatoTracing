const mongoose = require('mongoose');
const path = require('path');

// Import the models
const Harvest = require('./schemas/harvest');
const Collection = require('./schemas/collection');
const Distribution = require('./schemas/distribution');
const Supermarket = require('./schemas/supermarket');
const User = require('./schemas/user');

async function setupDatabase() {
    try {
        console.log('🚀 Setting up database...');
        
        // Connect to MongoDB
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/test-db');
        console.log('✅ Connected to MongoDB successfully!');
        
        // Test database operations
        console.log('🔄 Testing database operations...');
        
        // Create a test user
        const testUser = new User({
            username: 'testuser',
            name: 'Test User',
            password: 'hashedpassword',
            privateKey: 'testprivatekey',
            publicKey: 'testpublickey'
        });
        
        await testUser.save();
        console.log('✅ User model test successful!');
        
        // Create a test harvest
        const testHarvest = new Harvest({
            harvestId: 'TEST_HARVEST_001',
            farmerName: 'Test Farmer',
            farmerContactInfo: '+94-71-123-4567',
            farmLocation: 'Test Location',
            harvestDateTime: new Date().toISOString(),
            harvestQuantity: '100.50',
            chemicalsUsed: 'Organic',
            owner: 'test-setup'
        });
        
        await testHarvest.save();
        console.log('✅ Harvest model test successful!');
        
        // Create a test collection
        const testCollection = new Collection({
            collectionId: 'TEST_COLLECTION_001',
            clerkName: 'Test Clerk',
            clerkContactInfo: '+94-71-111-2222',
            collectionDateTime: new Date().toISOString(),
            collectionQuantity: '95.25',
            distributeLocation: 'Test Collection Center',
            distributeTemperature: '18.5',
            distributeStorageConditions: 'Refrigerated',
            harvestId: 'TEST_HARVEST_001',
            owner: 'test-setup'
        });
        
        await testCollection.save();
        console.log('✅ Collection model test successful!');
        
        // Create a test distribution
        const testDistribution = new Distribution({
            distributionId: 'TEST_DISTRIBUTION_001',
            distributorName: 'Test Distributor',
            distributorContactInfo: '+94-71-777-8888',
            deliveryDateTime: new Date().toISOString(),
            deliveryQuantity: '90.00',
            deliverLocation: 'Test Distribution Hub',
            deliverTemperature: '16.0',
            deliverStorageConditions: 'Cool Storage',
            collectionId: 'TEST_COLLECTION_001',
            owner: 'test-setup'
        });
        
        await testDistribution.save();
        console.log('✅ Distribution model test successful!');
        
        // Create a test supermarket record
        const testSupermarket = new Supermarket({
            supermarketId: 'TEST_SUPERMARKET_001',
            supermarketName: 'Test Supermarket',
            supermarketContactInfo: '+94-71-333-4444',
            supermarketReceiveDateTime: new Date().toISOString(),
            supermarketQuantity: '85.75',
            supermarketPrice: '25.50',
            promotions: 'None',
            labels: 'Fresh Harvest',
            qrCode: 'https://example.com/qr/TEST_DISTRIBUTION_001',
            distributionId: 'TEST_DISTRIBUTION_001',
            owner: 'test-setup'
        });
        
        await testSupermarket.save();
        console.log('✅ Supermarket model test successful!');
        
        // Get counts
        const userCount = await User.countDocuments();
        const harvestCount = await Harvest.countDocuments();
        const collectionCount = await Collection.countDocuments();
        const distributionCount = await Distribution.countDocuments();
        const supermarketCount = await Supermarket.countDocuments();
        
        console.log('\n📊 Database Summary:');
        console.log(`   Users: ${userCount}`);
        console.log(`   Harvests: ${harvestCount}`);
        console.log(`   Collections: ${collectionCount}`);
        console.log(`   Distributions: ${distributionCount}`);
        console.log(`   Supermarkets: ${supermarketCount}`);
        
        // Clean up test data
        console.log('\n🧹 Cleaning up test data...');
        await User.deleteOne({ username: 'testuser' });
        await Harvest.deleteOne({ harvestId: 'TEST_HARVEST_001' });
        await Collection.deleteOne({ collectionId: 'TEST_COLLECTION_001' });
        await Distribution.deleteOne({ distributionId: 'TEST_DISTRIBUTION_001' });
        await Supermarket.deleteOne({ supermarketId: 'TEST_SUPERMARKET_001' });
        console.log('✅ Test data cleaned up!');
        
        console.log('\n🎉 Database setup completed successfully!');
        console.log('✅ All models are working correctly');
        console.log('✅ Database connection is stable');
        console.log('✅ Ready to run the application!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the setup
setupDatabase();

