const mongoose = require('mongoose');

const distributionSchema = new mongoose.Schema({
    distributionId:String,
    distributorName:String,
    distributorContactInfo:String,
    deliveryDateTime:String,
    deliveryQuantity:String,
    deliverLocation:String,
    deliverTemperature:String,
    deliverStorageConditions:String,
    collectionId:String,
    owner:String, // Add owner field for user identification
});

const Distribution= mongoose.model('Distribution', distributionSchema);

module.exports = Distribution;