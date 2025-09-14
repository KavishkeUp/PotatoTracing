const mongoose = require('mongoose');

const supermarketSchema = new mongoose.Schema({
    supermarketId:String,
    supermarketName:String,
    supermarketContactInfo:String,
    supermarketReceiveDateTime:String,
    supermarketQuantity:String,
    supermarketPrice:String,
    promotions:String,
    labels:String,
    qrCode:String,
    distributionId:String,
    owner:String, // Add owner field for user identification
});

const Supermarket= mongoose.model('Supermarket', supermarketSchema);

module.exports = Supermarket;