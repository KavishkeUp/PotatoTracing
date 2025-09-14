const mongoose = require('mongoose');

// Import the models
const Harvest = require('./schemas/harvest');
const Collection = require('./schemas/collection');
const Distribution = require('./schemas/distribution');
const Supermarket = require('./schemas/supermarket');
const User = require('./schemas/user');

async function verifyDatabase() {
    try {
        console.log('🔍 Verifying database...');
        
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/test-db');
        console.log('✅ Connected to MongoDB');
        
        // Get counts
        const userCount = await User.countDocuments();
        const harvestCount = await Harvest.countDocuments();
        const collectionCount = await Collection.countDocuments();
        const distributionCount = await Distribution.countDocuments();
        const supermarketCount = await Supermarket.countDocuments();
        
        console.log('\n📊 Database Contents:');
        console.log('   👥 Users:', userCount);
        console.log('   🌾 Harvests:', harvestCount);
        console.log('   📦 Collections:', collectionCount);
        console.log('   🚚 Distributions:', distributionCount);
        console.log('   🏪 Supermarkets:', supermarketCount);
        
        if (harvestCount > 0) {
            console.log('\n✅ Database is populated with data!');
            console.log('🎉 Your application is ready to use!');
        } else {
            console.log('\n⚠️  Database is empty. You may need to run the seed script.');
        }
        
        // Show sample data
        if (harvestCount > 0) {
            const sampleHarvest = await Harvest.findOne();
            console.log('\n📋 Sample Harvest Record:');
            console.log('   ID:', sampleHarvest.harvestId);
            console.log('   Farmer:', sampleHarvest.farmerName);
            console.log('   Location:', sampleHarvest.farmLocation);
            console.log('   Quantity:', sampleHarvest.harvestQuantity);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Connection closed');
    }
}

verifyDatabase();
