const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    testId:String,
    qrCode:String,
    testName:String


});

const Test= mongoose.model('Test', testSchema);

module.exports = Test;