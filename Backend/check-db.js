const mongoose = require('mongoose');
const Supermarket = require('./schemas/supermarket');

async function checkDatabase() {
    try {
        console.log('🔍 Checking database...');
        
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/test-db');
        console.log('✅ Connected to MongoDB');
        
        // Check what's in the supermarket collection
        const supermarkets = await Supermarket.find({});
        console.log('📊 Supermarkets in database:', supermarkets.length);
        
        if (supermarkets.length > 0) {
            console.log('📋 Sample supermarket data:');
            supermarkets.forEach((supermarket, index) => {
                console.log(`${index + 1}. ID: ${supermarket.supermarketId}, Name: ${supermarket.supermarketName}`);
            });
        } else {
            console.log('❌ No supermarkets found in database');
        }
        
        // Check specifically for D01
        const d01 = await Supermarket.findOne({ supermarketId: 'D01' });
        if (d01) {
            console.log('✅ Found D01:', d01.supermarketName);
        } else {
            console.log('❌ D01 not found');
        }
        
    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

checkDatabase();
