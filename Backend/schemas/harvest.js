// class Potato {
//     constructor(farmerName, contactInfo, location, harvestDateTime, quantity, chemicals, clerkDetails) {
//         this.farmerName = farmerName;
//         this.farmerContactInfo = contactInfo;
//         this.location = location;
//         this.harvestDateTime = harvestDateTime;
//         this.quantity = quantity;
//         this.chemicals = chemicals;
//         this.clerkDetails = clerkDetails;



//     }

//     // You can add methods to the Potato class for additional functionality or validation.

//     toJSON() {
//         return {
//             farmerName: this.farmerName,
//             contactInfo: this.contactInfo,
//             location: this.location,
//             harvestDateTime: this.harvestDateTime,
//             quantity: this.quantity,
//             chemicals: this.chemicals,
//             clerkDetails: this.clerkDetails
//         };
//     }
// }
const mongoose = require('mongoose');

const harvestSchema = new mongoose.Schema({
    harvestId:String,
    farmerName:String,
    farmerContactInfo:String,
    farmLocation:String,
    harvestDateTime :String,
    harvestQuantity:String,
    chemicalsUsed:String,
    owner:String, // Add owner field for user identification
});

const Harvest = mongoose.model('Harvest', harvestSchema);

module.exports = Harvest;



