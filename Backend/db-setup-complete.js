const mongoose = require('mongoose');
const path = require('path');

// Import the models
const Harvest = require('./schemas/harvest');
const Collection = require('./schemas/collection');
const Distribution = require('./schemas/distribution');
const Supermarket = require('./schemas/supermarket');
const User = require('./schemas/user');

async function setupAndVerifyDatabase() {
    console.log('='.repeat(60));
    console.log('🚀 POTATO TRACEABILITY SYSTEM - DATABASE SETUP');
    console.log('='.repeat(60));
    
    try {
        // Step 1: Connect to MongoDB
        console.log('\n📡 STEP 1: Connecting to MongoDB...');
        console.log('   Connection string: mongodb://localhost:27017/test-db');
        
        await mongoose.connect('mongodb://localhost:27017/test-db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
        });
        
        console.log('   ✅ Connected successfully!');
        console.log('   📊 Database name:', mongoose.connection.db.databaseName);
        console.log('   🔗 Connection state:', mongoose.connection.readyState);
        
        // Step 2: Test all models
        console.log('\n🧪 STEP 2: Testing database models...');
        
        // Test User model
        console.log('   Testing User model...');
        const testUser = new User({
            username: 'testuser_' + Date.now(),
            name: 'Test User',
            password: 'hashedpassword',
            privateKey: 'testprivatekey',
            publicKey: 'testpublickey'
        });
        await testUser.save();
        console.log('   ✅ User model working');
        
        // Test Harvest model
        console.log('   Testing Harvest model...');
        const testHarvest = new Harvest({
            harvestId: 'TEST_HARVEST_' + Date.now(),
            farmerName: 'Test Farmer',
            farmerContactInfo: '+94-71-123-4567',
            farmLocation: 'Test Location',
            harvestDateTime: new Date().toISOString(),
            harvestQuantity: '100.50',
            chemicalsUsed: 'Organic',
            owner: 'test-setup'
        });
        await testHarvest.save();
        console.log('   ✅ Harvest model working');
        
        // Test Collection model
        console.log('   Testing Collection model...');
        const testCollection = new Collection({
            collectionId: 'TEST_COLLECTION_' + Date.now(),
            clerkName: 'Test Clerk',
            clerkContactInfo: '+94-71-111-2222',
            collectionDateTime: new Date().toISOString(),
            collectionQuantity: '95.25',
            distributeLocation: 'Test Collection Center',
            distributeTemperature: '18.5',
            distributeStorageConditions: 'Refrigerated',
            harvestId: testHarvest.harvestId,
            owner: 'test-setup'
        });
        await testCollection.save();
        console.log('   ✅ Collection model working');
        
        // Test Distribution model
        console.log('   Testing Distribution model...');
        const testDistribution = new Distribution({
            distributionId: 'TEST_DISTRIBUTION_' + Date.now(),
            distributorName: 'Test Distributor',
            distributorContactInfo: '+94-71-777-8888',
            deliveryDateTime: new Date().toISOString(),
            deliveryQuantity: '90.00',
            deliverLocation: 'Test Distribution Hub',
            deliverTemperature: '16.0',
            deliverStorageConditions: 'Cool Storage',
            collectionId: testCollection.collectionId,
            owner: 'test-setup'
        });
        await testDistribution.save();
        console.log('   ✅ Distribution model working');
        
        // Test Supermarket model
        console.log('   Testing Supermarket model...');
        const testSupermarket = new Supermarket({
            supermarketId: 'TEST_SUPERMARKET_' + Date.now(),
            supermarketName: 'Test Supermarket',
            supermarketContactInfo: '+94-71-333-4444',
            supermarketReceiveDateTime: new Date().toISOString(),
            supermarketQuantity: '85.75',
            supermarketPrice: '25.50',
            promotions: 'None',
            labels: 'Fresh Harvest',
            qrCode: 'https://example.com/qr/' + testDistribution.distributionId,
            distributionId: testDistribution.distributionId,
            owner: 'test-setup'
        });
        await testSupermarket.save();
        console.log('   ✅ Supermarket model working');
        
        // Step 3: Get database statistics
        console.log('\n📊 STEP 3: Database statistics...');
        const userCount = await User.countDocuments();
        const harvestCount = await Harvest.countDocuments();
        const collectionCount = await Collection.countDocuments();
        const distributionCount = await Distribution.countDocuments();
        const supermarketCount = await Supermarket.countDocuments();
        
        console.log('   👥 Users:', userCount);
        console.log('   🌾 Harvests:', harvestCount);
        console.log('   📦 Collections:', collectionCount);
        console.log('   🚚 Distributions:', distributionCount);
        console.log('   🏪 Supermarkets:', supermarketCount);
        
        // Step 4: Test relationships
        console.log('\n🔗 STEP 4: Testing data relationships...');
        
        // Find harvest and its related collection
        const foundHarvest = await Harvest.findOne({ harvestId: testHarvest.harvestId });
        const relatedCollection = await Collection.findOne({ harvestId: foundHarvest.harvestId });
        const relatedDistribution = await Distribution.findOne({ collectionId: relatedCollection.collectionId });
        const relatedSupermarket = await Supermarket.findOne({ distributionId: relatedDistribution.distributionId });
        
        console.log('   ✅ Harvest → Collection relationship working');
        console.log('   ✅ Collection → Distribution relationship working');
        console.log('   ✅ Distribution → Supermarket relationship working');
        
        // Step 5: Clean up test data
        console.log('\n🧹 STEP 5: Cleaning up test data...');
        await User.deleteOne({ username: testUser.username });
        await Harvest.deleteOne({ harvestId: testHarvest.harvestId });
        await Collection.deleteOne({ collectionId: testCollection.collectionId });
        await Distribution.deleteOne({ distributionId: testDistribution.distributionId });
        await Supermarket.deleteOne({ supermarketId: testSupermarket.supermarketId });
        console.log('   ✅ Test data cleaned up');
        
        // Final summary
        console.log('\n' + '='.repeat(60));
        console.log('🎉 DATABASE SETUP COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log('✅ MongoDB connection: WORKING');
        console.log('✅ All database models: WORKING');
        console.log('✅ Data relationships: WORKING');
        console.log('✅ Database operations: WORKING');
        console.log('\n🚀 Your application is ready to run!');
        console.log('📝 Next steps:');
        console.log('   1. Run: npm start (in Backend directory)');
        console.log('   2. Run: npm start (in Frontend directory)');
        console.log('   3. Access: http://localhost:8080');
        console.log('='.repeat(60));
        
    } catch (error) {
        console.log('\n' + '='.repeat(60));
        console.log('❌ DATABASE SETUP FAILED!');
        console.log('='.repeat(60));
        console.error('Error details:');
        console.error('  Name:', error.name);
        console.error('  Message:', error.message);
        console.error('  Code:', error.code);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Make sure MongoDB is running: net start MongoDB');
        console.log('   2. Check if port 27017 is available');
        console.log('   3. Verify MongoDB installation');
        console.log('='.repeat(60));
        process.exit(1);
    } finally {
        // Close database connection
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the setup
setupAndVerifyDatabase();

