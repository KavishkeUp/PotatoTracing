const mongoose = require('mongoose');

// Import the models
const Harvest = require('./schemas/harvest');
const Collection = require('./schemas/collection');
const Distribution = require('./schemas/distribution');
const Supermarket = require('./schemas/supermarket');

async function cleanupData() {
    try {
        console.log('🧹 Starting data cleanup...');
        
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/test-db');
        console.log('✅ Connected to MongoDB');

        // Get counts before cleanup
        const harvestCountBefore = await Harvest.countDocuments({ owner: 'seeding-script' });
        const collectionCountBefore = await Collection.countDocuments({ owner: 'seeding-script' });
        const distributionCountBefore = await Distribution.countDocuments({ owner: 'seeding-script' });
        const supermarketCountBefore = await Supermarket.countDocuments({ owner: 'seeding-script' });

        console.log('\n📊 Records before cleanup:');
        console.log(`   Harvests: ${harvestCountBefore}`);
        console.log(`   Collections: ${collectionCountBefore}`);
        console.log(`   Distributions: ${distributionCountBefore}`);
        console.log(`   Supermarkets: ${supermarketCountBefore}`);

        // Delete seeded data
        console.log('\n🗑️ Deleting seeded data...');
        
        const harvestResult = await Harvest.deleteMany({ owner: 'seeding-script' });
        const collectionResult = await Collection.deleteMany({ owner: 'seeding-script' });
        const distributionResult = await Distribution.deleteMany({ owner: 'seeding-script' });
        const supermarketResult = await Supermarket.deleteMany({ owner: 'seeding-script' });

        console.log('✅ Cleanup completed!');
        console.log(`   Deleted ${harvestResult.deletedCount} harvests`);
        console.log(`   Deleted ${collectionResult.deletedCount} collections`);
        console.log(`   Deleted ${distributionResult.deletedCount} distributions`);
        console.log(`   Deleted ${supermarketResult.deletedCount} supermarket records`);

        // Get counts after cleanup
        const harvestCountAfter = await Harvest.countDocuments({ owner: 'seeding-script' });
        const collectionCountAfter = await Collection.countDocuments({ owner: 'seeding-script' });
        const distributionCountAfter = await Distribution.countDocuments({ owner: 'seeding-script' });
        const supermarketCountAfter = await Supermarket.countDocuments({ owner: 'seeding-script' });

        console.log('\n📊 Records after cleanup:');
        console.log(`   Harvests: ${harvestCountAfter}`);
        console.log(`   Collections: ${collectionCountAfter}`);
        console.log(`   Distributions: ${distributionCountAfter}`);
        console.log(`   Supermarkets: ${supermarketCountAfter}`);

        console.log('\n✅ Data cleanup completed successfully!');

    } catch (error) {
        console.error('❌ Error during data cleanup:', error);
        throw error;
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run if called directly
if (require.main === module) {
    cleanupData()
        .then(() => {
            console.log('\n✨ Cleanup script completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Cleanup script failed:', error);
            process.exit(1);
        });
}

module.exports = { cleanupData };
