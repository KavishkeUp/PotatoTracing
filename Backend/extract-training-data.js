const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');

// Import the models
const Harvest = require('./schemas/harvest');
const Collection = require('./schemas/collection');
const Distribution = require('./schemas/distribution');
const Supermarket = require('./schemas/supermarket');

async function extractTrainingData() {
    try {
        console.log('🔍 Extracting training data from database...');
        
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/test-db');
        console.log('✅ Connected to MongoDB');

        // Get all supermarket records (these contain the prices)
        const supermarketRecords = await Supermarket.find({}).sort({ supermarketReceiveDateTime: -1 });
        console.log(`📊 Found ${supermarketRecords.length} supermarket records`);

        // Get all harvest records
        const harvestRecords = await Harvest.find({}).sort({ harvestDateTime: -1 });
        console.log(`📊 Found ${harvestRecords.length} harvest records`);

        // Get all collection records
        const collectionRecords = await Collection.find({}).sort({ collectionDateTime: -1 });
        console.log(`📊 Found ${collectionRecords.length} collection records`);

        // Get all distribution records
        const distributionRecords = await Distribution.find({}).sort({ deliveryDateTime: -1 });
        console.log(`📊 Found ${distributionRecords.length} distribution records`);

        // Create a map for quick lookup
        const harvestMap = new Map();
        const collectionMap = new Map();
        const distributionMap = new Map();

        harvestRecords.forEach(harvest => {
            harvestMap.set(harvest.harvestId, harvest);
        });

        collectionRecords.forEach(collection => {
            collectionMap.set(collection.collectionId, collection);
        });

        distributionRecords.forEach(distribution => {
            distributionMap.set(distribution.distributionId, distribution);
        });

        // Prepare training data
        const trainingData = [];

        supermarketRecords.forEach(supermarket => {
            const distribution = distributionMap.get(supermarket.distributionId);
            if (!distribution) return;

            const collection = collectionMap.get(distribution.collectionId);
            if (!collection) return;

            const harvest = harvestMap.get(collection.harvestId);
            if (!harvest) return;

            // Extract features
            const harvestDate = new Date(harvest.harvestDateTime);
            const collectionDate = new Date(collection.collectionDateTime);
            const distributionDate = new Date(distribution.deliveryDateTime);
            const supermarketDate = new Date(supermarket.supermarketReceiveDateTime);

            // Calculate time-based features
            const daysFromHarvestToCollection = Math.floor((collectionDate - harvestDate) / (1000 * 60 * 60 * 24));
            const daysFromCollectionToDistribution = Math.floor((distributionDate - collectionDate) / (1000 * 60 * 60 * 24));
            const daysFromDistributionToSupermarket = Math.floor((supermarketDate - distributionDate) / (1000 * 60 * 60 * 24));
            const totalDaysInSupplyChain = daysFromHarvestToCollection + daysFromCollectionToDistribution + daysFromDistributionToSupermarket;

            // Extract month and season
            const harvestMonth = harvestDate.getMonth() + 1; // 1-12
            const season = getSeason(harvestMonth);

            // Extract location features
            const origin = harvest.farmLocation;
            const marketLocation = supermarket.supermarketName; // Using supermarket name as location proxy

            // Extract quantity features
            const harvestQuantity = parseFloat(harvest.harvestQuantity) || 0;
            const collectionQuantity = parseFloat(collection.collectionQuantity) || 0;
            const distributionQuantity = parseFloat(distribution.deliveryQuantity) || 0;
            const supermarketQuantity = parseFloat(supermarket.supermarketQuantity) || 0;

            // Calculate quantity loss percentages
            const collectionLossPercent = harvestQuantity > 0 ? ((harvestQuantity - collectionQuantity) / harvestQuantity) * 100 : 0;
            const distributionLossPercent = collectionQuantity > 0 ? ((collectionQuantity - distributionQuantity) / collectionQuantity) * 100 : 0;
            const supermarketLossPercent = distributionQuantity > 0 ? ((distributionQuantity - supermarketQuantity) / distributionQuantity) * 100 : 0;

            // Extract price (target variable)
            const price = parseFloat(supermarket.supermarketPrice) || 0;

            // Create training record
            const record = {
                // Time features
                harvestMonth,
                season,
                daysFromHarvestToCollection,
                daysFromCollectionToDistribution,
                daysFromDistributionToSupermarket,
                totalDaysInSupplyChain,

                // Quantity features
                harvestQuantity,
                collectionQuantity,
                distributionQuantity,
                supermarketQuantity,
                collectionLossPercent,
                distributionLossPercent,
                supermarketLossPercent,

                // Location features (encoded)
                origin: encodeLocation(origin),
                marketLocation: encodeLocation(marketLocation),

                // Chemical features
                chemicalsUsed: encodeChemicals(harvest.chemicalsUsed),

                // Storage features
                collectionStorageConditions: encodeStorageConditions(collection.distributeStorageConditions),
                distributionStorageConditions: encodeStorageConditions(distribution.deliverStorageConditions),

                // Temperature features
                collectionTemperature: parseFloat(collection.distributeTemperature) || 20,
                distributionTemperature: parseFloat(distribution.deliverTemperature) || 20,

                // Market features
                promotions: encodePromotions(supermarket.promotions),
                labels: encodeLabels(supermarket.labels),

                // Target variable
                price
            };

            trainingData.push(record);
        });

        console.log(`📊 Prepared ${trainingData.length} training records`);

        if (trainingData.length === 0) {
            console.log('❌ No training data found. Please ensure you have complete traceability chains in the database.');
            return;
        }

        // Save training data to Excel for inspection
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(trainingData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Training Data');
        
        const excelPath = path.join(__dirname, 'training_data.xlsx');
        XLSX.writeFile(workbook, excelPath);
        console.log(`📄 Training data saved to: ${excelPath}`);

        // Display sample data
        console.log('\n📋 Sample training data:');
        trainingData.slice(0, 3).forEach((record, index) => {
            console.log(`Record ${index + 1}:`);
            console.log(`  Price: $${record.price}`);
            console.log(`  Harvest Quantity: ${record.harvestQuantity}kg`);
            console.log(`  Season: ${record.season}`);
            console.log(`  Total Days: ${record.totalDaysInSupplyChain}`);
            console.log(`  Origin: ${record.origin}`);
            console.log(`  Market: ${record.marketLocation}`);
            console.log('');
        });

        // Calculate statistics
        const prices = trainingData.map(r => r.price).filter(p => p > 0);
        const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        console.log('📈 Price Statistics:');
        console.log(`  Average Price: $${avgPrice.toFixed(2)}`);
        console.log(`  Min Price: $${minPrice.toFixed(2)}`);
        console.log(`  Max Price: $${maxPrice.toFixed(2)}`);
        console.log(`  Total Records: ${trainingData.length}`);

        return trainingData;

    } catch (error) {
        console.error('❌ Error extracting training data:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Helper functions
function getSeason(month) {
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
}

function encodeLocation(location) {
    if (!location) return 0;
    const locations = [
        'Kandy', 'Jaffna', 'Anuradhapura', 'Galle', 'Trincomalee',
        'Kurunegala', 'Ratnapura', 'Badulla', 'Polonnaruwa', 'Matara',
        'Colombo', 'Nuwara Eliya', 'Batticaloa', 'Ampara', 'Monaragala'
    ];
    const index = locations.findIndex(loc => location.toLowerCase().includes(loc.toLowerCase()));
    return index >= 0 ? index + 1 : 0;
}

function encodeChemicals(chemicals) {
    if (!chemicals) return 0;
    const chemicalTypes = ['Organic', 'Minimal Pesticides', 'Standard Fertilizers', 'Natural Methods'];
    const index = chemicalTypes.findIndex(chem => chemicals.toLowerCase().includes(chem.toLowerCase()));
    return index >= 0 ? index + 1 : 0;
}

function encodeStorageConditions(conditions) {
    if (!conditions) return 0;
    const storageTypes = ['Refrigerated', 'Cool Storage', 'Controlled Atmosphere', 'Dry Storage'];
    const index = storageTypes.findIndex(storage => conditions.toLowerCase().includes(storage.toLowerCase()));
    return index >= 0 ? index + 1 : 0;
}

function encodePromotions(promotions) {
    if (!promotions) return 0;
    const promotionTypes = ['Buy 2 Get 1 Free', '20% Off', 'Weekend Special', 'Bulk Discount', 'None'];
    const index = promotionTypes.findIndex(promo => promotions.toLowerCase().includes(promo.toLowerCase()));
    return index >= 0 ? index + 1 : 0;
}

function encodeLabels(labels) {
    if (!labels) return 0;
    const labelTypes = ['Organic Certified', 'Fresh Harvest', 'Premium Quality', 'Local Farm', 'Standard'];
    const index = labelTypes.findIndex(label => labels.toLowerCase().includes(label.toLowerCase()));
    return index >= 0 ? index + 1 : 0;
}

// Run if called directly
if (require.main === module) {
    extractTrainingData()
        .then(() => {
            console.log('\n✨ Training data extraction completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Training data extraction failed:', error);
            process.exit(1);
        });
}

module.exports = { extractTrainingData };
