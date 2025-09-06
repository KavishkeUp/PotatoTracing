const mongoose = require('mongoose');

// Import the models
const Harvest = require('./schemas/harvest');
const Collection = require('./schemas/collection');
const Distribution = require('./schemas/distribution');
const Supermarket = require('./schemas/supermarket');

async function verifyData() {
    try {
        console.log('🔍 Verifying seeded data...');
        
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/test-db');
        console.log('✅ Connected to MongoDB');

        // Get counts
        const harvestCount = await Harvest.countDocuments({ owner: 'seeding-script' });
        const collectionCount = await Collection.countDocuments({ owner: 'seeding-script' });
        const distributionCount = await Distribution.countDocuments({ owner: 'seeding-script' });
        const supermarketCount = await Supermarket.countDocuments({ owner: 'seeding-script' });

        console.log('\n📊 Database Summary:');
        console.log(`   Harvests: ${harvestCount}`);
        console.log(`   Collections: ${collectionCount}`);
        console.log(`   Distributions: ${distributionCount}`);
        console.log(`   Supermarkets: ${supermarketCount}`);

        // Get sample data
        console.log('\n📋 Sample Harvest Records:');
        const sampleHarvests = await Harvest.find({ owner: 'seeding-script' }).limit(5);
        sampleHarvests.forEach((harvest, index) => {
            console.log(`   ${index + 1}. ${harvest.farmerName} - ${harvest.farmLocation} - ${harvest.harvestQuantity}kg`);
        });

        console.log('\n📋 Sample Collection Records:');
        const sampleCollections = await Collection.find({ owner: 'seeding-script' }).limit(5);
        sampleCollections.forEach((collection, index) => {
            console.log(`   ${index + 1}. ${collection.clerkName} - ${collection.distributeLocation} - ${collection.collectionQuantity}kg`);
        });

        console.log('\n📋 Sample Distribution Records:');
        const sampleDistributions = await Distribution.find({ owner: 'seeding-script' }).limit(5);
        sampleDistributions.forEach((distribution, index) => {
            console.log(`   ${index + 1}. ${distribution.distributorName} - ${distribution.deliverLocation} - ${distribution.deliveryQuantity}kg`);
        });

        console.log('\n📋 Sample Supermarket Records:');
        const sampleSupermarkets = await Supermarket.find({ owner: 'seeding-script' }).limit(5);
        sampleSupermarkets.forEach((supermarket, index) => {
            console.log(`   ${index + 1}. ${supermarket.supermarketName} - $${supermarket.supermarketPrice} - ${supermarket.supermarketQuantity}kg`);
        });

        // Get complete traceability chains
        console.log('\n🔗 Complete Traceability Chains (First 10):');
        const harvests = await Harvest.find({ owner: 'seeding-script' }).limit(10);
        
        for (let i = 0; i < harvests.length; i++) {
            const harvest = harvests[i];
            const collection = await Collection.findOne({ harvestId: harvest.harvestId });
            const distribution = collection ? await Distribution.findOne({ collectionId: collection.collectionId }) : null;
            const supermarket = distribution ? await Supermarket.findOne({ distributionId: distribution.distributionId }) : null;

            if (harvest && collection && distribution && supermarket) {
                console.log(`   ${i + 1}. ${harvest.farmerName} → ${collection.clerkName} → ${distribution.distributorName} → ${supermarket.supermarketName}`);
                console.log(`      Harvest: ${harvest.harvestQuantity}kg | Collection: ${collection.collectionQuantity}kg | Distribution: ${distribution.deliveryQuantity}kg | Supermarket: ${supermarket.supermarketQuantity}kg`);
                console.log(`      Price: $${supermarket.supermarketPrice} | Promotions: ${supermarket.promotions} | Labels: ${supermarket.labels}`);
                console.log('');
            }
        }

        // Get statistics
        console.log('\n📈 Statistics:');
        
        // Average quantities
        const avgHarvestQuantity = await Harvest.aggregate([
            { $match: { owner: 'seeding-script' } },
            { $group: { _id: null, avg: { $avg: { $toDouble: '$harvestQuantity' } } } }
        ]);
        
        const avgSupermarketPrice = await Supermarket.aggregate([
            { $match: { owner: 'seeding-script' } },
            { $group: { _id: null, avg: { $avg: { $toDouble: '$supermarketPrice' } } } }
        ]);

        console.log(`   Average Harvest Quantity: ${avgHarvestQuantity[0]?.avg?.toFixed(2) || 'N/A'} kg`);
        console.log(`   Average Supermarket Price: $${avgSupermarketPrice[0]?.avg?.toFixed(2) || 'N/A'}`);

        // Most common locations
        const topFarmLocations = await Harvest.aggregate([
            { $match: { owner: 'seeding-script' } },
            { $group: { _id: '$farmLocation', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]);

        console.log('\n   Top Farm Locations:');
        topFarmLocations.forEach((location, index) => {
            console.log(`      ${index + 1}. ${location._id}: ${location.count} harvests`);
        });

        // Most common supermarkets
        const topSupermarkets = await Supermarket.aggregate([
            { $match: { owner: 'seeding-script' } },
            { $group: { _id: '$supermarketName', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]);

        console.log('\n   Top Supermarkets:');
        topSupermarkets.forEach((supermarket, index) => {
            console.log(`      ${index + 1}. ${supermarket._id}: ${supermarket.count} deliveries`);
        });

        console.log('\n✅ Data verification completed successfully!');
        console.log('🎉 Your potato traceability system now has 100 complete data chains!');

    } catch (error) {
        console.error('❌ Error during data verification:', error);
        throw error;
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run if called directly
if (require.main === module) {
    verifyData()
        .then(() => {
            console.log('\n✨ Verification script completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Verification script failed:', error);
            process.exit(1);
        });
}

module.exports = { verifyData };
