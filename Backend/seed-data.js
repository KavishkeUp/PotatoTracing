const XLSX = require('xlsx');
const axios = require('axios');
const path = require('path');

// Configuration
const API_BASE_URL = 'http://localhost:8080/api';
const EXCEL_FILE_PATH = path.join(__dirname, '..', 'Historical Data.xlsx');

// Sample data for different roles
const SAMPLE_FARMERS = [
    { name: 'John Smith', contact: '+94-71-123-4567', location: 'Kandy, Central Province' },
    { name: 'Maria Garcia', contact: '+94-77-234-5678', location: 'Jaffna, Northern Province' },
    { name: 'Ahmed Hassan', contact: '+94-76-345-6789', location: 'Anuradhapura, North Central Province' },
    { name: 'Priya Patel', contact: '+94-75-456-7890', location: 'Galle, Southern Province' },
    { name: 'David Wilson', contact: '+94-74-567-8901', location: 'Trincomalee, Eastern Province' },
    { name: 'Fatima Ali', contact: '+94-73-678-9012', location: 'Kurunegala, North Western Province' },
    { name: 'Robert Brown', contact: '+94-72-789-0123', location: 'Ratnapura, Sabaragamuwa Province' },
    { name: 'Sita Kumari', contact: '+94-71-890-1234', location: 'Badulla, Uva Province' },
    { name: 'Michael Chen', contact: '+94-77-901-2345', location: 'Polonnaruwa, North Central Province' },
    { name: 'Aisha Rahman', contact: '+94-76-012-3456', location: 'Matara, Southern Province' }
];

const SAMPLE_CLERKS = [
    { name: 'Sarah Johnson', contact: '+94-71-111-2222', location: 'Kandy Collection Center' },
    { name: 'Rajesh Kumar', contact: '+94-77-222-3333', location: 'Jaffna Collection Center' },
    { name: 'Lisa Anderson', contact: '+94-76-333-4444', location: 'Anuradhapura Collection Center' },
    { name: 'Mohammed Khan', contact: '+94-75-444-5555', location: 'Galle Collection Center' },
    { name: 'Emma Davis', contact: '+94-74-555-6666', location: 'Trincomalee Collection Center' }
];

const SAMPLE_DISTRIBUTORS = [
    { name: 'Green Logistics Ltd', contact: '+94-71-777-8888', location: 'Colombo Distribution Hub' },
    { name: 'Fresh Express Co', contact: '+94-77-888-9999', location: 'Kandy Distribution Hub' },
    { name: 'Quality Transport', contact: '+94-76-999-0000', location: 'Jaffna Distribution Hub' },
    { name: 'Swift Delivery', contact: '+94-75-000-1111', location: 'Galle Distribution Hub' },
    { name: 'Reliable Cargo', contact: '+94-74-111-2222', location: 'Anuradhapura Distribution Hub' }
];

const SAMPLE_SUPERMARKETS = [
    { name: 'Fresh Market Super', contact: '+94-71-333-4444', location: 'Colombo City Center' },
    { name: 'Organic Foods Plus', contact: '+94-77-444-5555', location: 'Kandy Mall' },
    { name: 'Quality Grocers', contact: '+94-76-555-6666', location: 'Jaffna Town' },
    { name: 'Premium Supermarket', contact: '+94-75-666-7777', location: 'Galle Fort' },
    { name: 'Family Mart', contact: '+94-74-777-8888', location: 'Anuradhapura City' }
];

// Helper function to generate random IDs
function generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate random date within a range
function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to format date
function formatDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Helper function to generate random quantity
function getRandomQuantity() {
    return (Math.random() * 1000 + 100).toFixed(2);
}

// Helper function to generate random price
function getRandomPrice() {
    return (Math.random() * 50 + 10).toFixed(2);
}

// Helper function to generate random temperature
function getRandomTemperature() {
    return (Math.random() * 10 + 15).toFixed(1);
}

// Helper function to generate random storage conditions
function getRandomStorageConditions() {
    const conditions = ['Refrigerated', 'Cool Storage', 'Controlled Atmosphere', 'Dry Storage'];
    return getRandomItem(conditions);
}

// Helper function to generate random chemicals
function getRandomChemicals() {
    const chemicals = ['Organic', 'Minimal Pesticides', 'Standard Fertilizers', 'Natural Methods'];
    return getRandomItem(chemicals);
}

// Helper function to generate random promotions
function getRandomPromotions() {
    const promotions = ['Buy 2 Get 1 Free', '20% Off', 'Weekend Special', 'Bulk Discount', 'None'];
    return getRandomItem(promotions);
}

// Helper function to generate random labels
function getRandomLabels() {
    const labels = ['Organic Certified', 'Fresh Harvest', 'Premium Quality', 'Local Farm', 'Standard'];
    return getRandomItem(labels);
}

// Function to create harvest record
async function createHarvest(farmer, harvestData, authToken) {
    try {
        const harvestPayload = {
            harvestId: generateId('HARVEST'),
            farmerName: farmer.name,
            farmerContactInfo: farmer.contact,
            farmLocation: farmer.location,
            harvestDateTime: harvestData.date || formatDate(getRandomDate(new Date('2024-01-01'), new Date())),
            harvestQuantity: harvestData.quantity || getRandomQuantity(),
            chemicalsUsed: harvestData.chemicals || getRandomChemicals()
        };

        console.log('Creating harvest:', harvestPayload.harvestId);
        
        const response = await axios.post(`${API_BASE_URL}/farmer/add-harvest`, harvestPayload, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        return harvestPayload.harvestId;
    } catch (error) {
        console.error('Error creating harvest:', error.response?.data || error.message);
        return null;
    }
}

// Function to create collection record
async function createCollection(harvestId, clerk, authToken) {
    try {
        const collectionPayload = {
            collectionId: generateId('COLLECTION'),
            clerkName: clerk.name,
            clerkContactInfo: clerk.contact,
            collectionDateTime: formatDate(getRandomDate(new Date('2024-01-01'), new Date())),
            collectionQuantity: getRandomQuantity(),
            distributeLocation: clerk.location,
            distributeTemperature: getRandomTemperature(),
            distributeStorageConditions: getRandomStorageConditions(),
            harvestId: harvestId
        };

        console.log('Creating collection:', collectionPayload.collectionId);
        
        const response = await axios.post(`${API_BASE_URL}/clerks/create-collection`, collectionPayload, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        return collectionPayload.collectionId;
    } catch (error) {
        console.error('Error creating collection:', error.response?.data || error.message);
        return null;
    }
}

// Function to create distribution record
async function createDistribution(collectionId, distributor, authToken) {
    try {
        const distributionPayload = {
            distributionId: generateId('DISTRIBUTION'),
            distributorName: distributor.name,
            distributorContactInfo: distributor.contact,
            deliveryDateTime: formatDate(getRandomDate(new Date('2024-01-01'), new Date())),
            deliveryQuantity: getRandomQuantity(),
            deliverLocation: distributor.location,
            deliverTemperature: getRandomTemperature(),
            deliverStorageConditions: getRandomStorageConditions(),
            collectionId: collectionId
        };

        console.log('Creating distribution:', distributionPayload.distributionId);
        
        const response = await axios.post(`${API_BASE_URL}/distributors/create-delivery`, distributionPayload, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        return distributionPayload.distributionId;
    } catch (error) {
        console.error('Error creating distribution:', error.response?.data || error.message);
        return null;
    }
}

// Function to create supermarket record
async function createSupermarket(distributionId, supermarket, authToken) {
    try {
        const supermarketPayload = {
            supermarketId: generateId('SUPERMARKET'),
            supermarketName: supermarket.name,
            supermarketContactInfo: supermarket.contact,
            supermarketReceiveDateTime: formatDate(getRandomDate(new Date('2024-01-01'), new Date())),
            supermarketQuantity: getRandomQuantity(),
            supermarketPrice: getRandomPrice(),
            promotions: getRandomPromotions(),
            labels: getRandomLabels(),
            distributionId: distributionId
        };

        console.log('Creating supermarket record:', supermarketPayload.supermarketId);
        
        const response = await axios.post(`${API_BASE_URL}/supermarkets/receive-delivery`, supermarketPayload, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        return supermarketPayload.supermarketId;
    } catch (error) {
        console.error('Error creating supermarket record:', error.response?.data || error.message);
        return null;
    }
}

// Function to create complete traceability chain
async function createTraceabilityChain(excelData, authToken) {
    const results = [];
    
    for (let i = 0; i < Math.min(excelData.length, 50); i++) { // Limit to 50 records for testing
        const data = excelData[i];
        const farmer = getRandomItem(SAMPLE_FARMERS);
        const clerk = getRandomItem(SAMPLE_CLERKS);
        const distributor = getRandomItem(SAMPLE_DISTRIBUTORS);
        const supermarket = getRandomItem(SAMPLE_SUPERMARKETS);

        console.log(`\n--- Creating Traceability Chain ${i + 1} ---`);

        // Create harvest
        const harvestId = await createHarvest(farmer, data, authToken);
        if (!harvestId) continue;

        // Create collection
        const collectionId = await createCollection(harvestId, clerk, authToken);
        if (!collectionId) continue;

        // Create distribution
        const distributionId = await createDistribution(collectionId, distributor, authToken);
        if (!distributionId) continue;

        // Create supermarket record
        const supermarketId = await createSupermarket(distributionId, supermarket, authToken);
        if (!supermarketId) continue;

        results.push({
            harvestId,
            collectionId,
            distributionId,
            supermarketId,
            farmer: farmer.name,
            clerk: clerk.name,
            distributor: distributor.name,
            supermarket: supermarket.name
        });

        console.log(`✅ Chain ${i + 1} completed successfully!`);
        
        // Add delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
}

// Main function to read Excel and seed data
async function seedData() {
    try {
        console.log('🚀 Starting data seeding process...');
        console.log('📖 Reading Excel file:', EXCEL_FILE_PATH);

        // Read Excel file
        const workbook = XLSX.readFile(EXCEL_FILE_PATH);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet);

        console.log(`📊 Found ${excelData.length} records in Excel file`);
        console.log('📋 Sample data structure:', excelData[0]);

        // For now, we'll use a dummy auth token
        // In a real scenario, you would need to authenticate first
        const authToken = 'dummy-auth-token-for-seeding';

        console.log('\n🌱 Creating traceability chains...');
        const results = await createTraceabilityChain(excelData, authToken);

        console.log('\n🎉 Data seeding completed!');
        console.log(`✅ Successfully created ${results.length} complete traceability chains`);
        
        console.log('\n📋 Summary of created chains:');
        results.forEach((result, index) => {
            console.log(`${index + 1}. ${result.farmer} → ${result.clerk} → ${result.distributor} → ${result.supermarket}`);
        });

        return results;

    } catch (error) {
        console.error('❌ Error during data seeding:', error);
        throw error;
    }
}

// Export the function
module.exports = { seedData };

// Run if called directly
if (require.main === module) {
    seedData()
        .then(() => {
            console.log('\n✨ Seeding script completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Seeding script failed:', error);
            process.exit(1);
        });
}
