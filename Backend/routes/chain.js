const {createHarvest, getPastRecords}= require('../controllers/harvest');
const {createCollection, getPastCollections} = require('../controllers/collection');
const { createDistribution, getPastDeliveries } = require('../controllers/distributors');
const { receiveDelivery, getReceivedDeliveries } = require('../controllers/supermarket');
const { getDetails } = require('../controllers/consumer');
const{newEntry} = require('../controllers/test')

const router = require('express').Router();


router.post('/farmer/add-harvest', createHarvest);
router.get('/farmer/past-records', getPastRecords);

router.post('/clerks/create-collection',createCollection)
router.get('/clerks/past-collections', getPastCollections);

router.post('/distributors/create-delivery',createDistribution);
router.get('/distributors/past-deliveries', getPastDeliveries);

router.post('/supermarkets/receive-delivery',receiveDelivery);
router.get('/supermarkets/received-deliveries', getReceivedDeliveries);

router.post('/entry', newEntry);


module.exports = router;