const mongoose = require('mongoose');

// Import the models
const Harvest = require('./schemas/harvest');
const Collection = require('./schemas/collection');
const Distribution = require('./schemas/distribution');
const Supermarket = require('./schemas/supermarket');

async function createTestData() {
    try {
        console.log('🚀 Creating test data...');
        
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/test-db');
        console.log('✅ Connected to MongoDB');
        
        // Clear existing test data
        await Harvest.deleteMany({ harvestId: 'H01' });
        await Collection.deleteMany({ collectionId: 'C01' });
        await Distribution.deleteMany({ distributionId: 'D01' });
        await Supermarket.deleteMany({ supermarketId: 'D01' });
        console.log('🧹 Cleared existing test data');
        
        // Create test harvest
        const harvest = new Harvest({
            harvestId: 'H01',
            farmerName: 'John Smith',
            farmerContactInfo: '+94-71-123-4567',
            farmLocation: 'Kandy, Central Province',
            harvestDateTime: '2024-01-13T06:00:00Z',
            harvestQuantity: '100.50',
            chemicalsUsed: 'Organic',
            owner: 'test-owner'
        });
        await harvest.save();
        console.log('✅ Created harvest: H01');
        
        // Create test collection
        const collection = new Collection({
            collectionId: 'C01',
            clerkName: 'Sarah Johnson',
            clerkContactInfo: '+94-71-111-2222',
            collectionDateTime: '2024-01-14T08:00:00Z',
            collectionQuantity: '95.25',
            distributeLocation: 'Kandy Collection Center',
            distributeTemperature: '18.5',
            distributeStorageConditions: 'Refrigerated',
            harvestId: 'H01',
            owner: 'test-owner'
        });
        await collection.save();
        console.log('✅ Created collection: C01');
        
        // Create test distribution
        const distribution = new Distribution({
            distributionId: 'D01',
            distributorName: 'Green Logistics Ltd',
            distributorContactInfo: '+94-71-777-8888',
            deliveryDateTime: '2024-01-15T10:30:00Z',
            deliveryQuantity: '90.00',
            deliverLocation: 'Colombo Distribution Hub',
            deliverTemperature: '16.0',
            deliverStorageConditions: 'Cool Storage',
            collectionId: 'C01',
            owner: 'test-owner'
        });
        await distribution.save();
        console.log('✅ Created distribution: D01');
        
        // Create test supermarket
        const supermarket = new Supermarket({
            supermarketId: 'D01',
            supermarketName: 'Fresh Market Super',
            supermarketContactInfo: '+94-71-333-4444',
            supermarketReceiveDateTime: '2024-01-16T14:00:00Z',
            supermarketQuantity: '85.75',
            supermarketPrice: '25.50',
            promotions: '20% Off',
            labels: 'Fresh Harvest',
            qrCode: 'http://localhost:8080/chain/consumers/D01',
            distributionId: 'D01',
            owner: 'test-owner'
        });
        await supermarket.save();
        console.log('✅ Created supermarket: D01');
        
        console.log('\n🎉 Test data created successfully!');
        console.log('📱 You can now test the consumer interface at:');
        console.log('   http://localhost:8080/chain/consumers/D01');
        
    } catch (error) {
        console.error('❌ Error creating test data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

createTestData();
