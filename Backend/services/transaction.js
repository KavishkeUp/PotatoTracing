const { createHash } = require('crypto')

const axios = require('axios').default;
const protobuf = require('sawtooth-sdk-js/protobuf');
const User = require('../schemas/user');
const { family } = require('../constants');
const { getSigner } = require('./credential');
const { decode } = require('punycode');

const sendTransaction = async (payload, signerPublicKey) => {
    const user = await User.findOne({
        publicKey: signerPublicKey
    })
    if (!user) {
        throw new Error('User key does not exist')
    }
    const signer = getSigner(user.privateKey)


    const payloadBytes = Buffer.from(JSON.stringify(payload));

    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: family.name,
        familyVersion: family.version,
        inputs: [family.namespace],
        outputs: [family.namespace],
        signerPublicKey,
        nonce: `${Math.random()}`,
        batcherPublicKey: signerPublicKey,
        dependencies: [],
        payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
    }).finish()

    const transaction = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: signer.sign(transactionHeaderBytes),
        payload: payloadBytes
    })

    const transactions = [transaction];

    const batchHeaderBytes = protobuf.BatchHeader.encode({
        signerPublicKey,
        transactionIds: transactions.map(t => t.headerSignature)
    }).finish();

    const batch = protobuf.Batch.create({
        header: batchHeaderBytes,
        headerSignature: signer.sign(batchHeaderBytes),
        transactions: transactions
    })
    const batches = [batch];
    const batchListBytes = protobuf.BatchList.encode({
        batches: batches
    }).finish();
    

    try {
        const response = await axios.post('http://localhost:8008/batches', batchListBytes, {
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            data: batchListBytes
        });
        
        
        console.log(response.data);
        return response.data; // Return the response data
    } catch (err) {

        console.log(err.response);
        throw err; // Re-throw the error
    }
}

// Function to fetch data from the Sawtooth REST API by ID
const fetchDataById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8008/state/${id}`);
        const data = response.data.data;
        if (data.length === 0) {
            console.log('No data found for the specified ID');
            return null;
        }
        const decodedData = Buffer.from(data[0].data, 'base64').toString('utf-8');
        return JSON.parse(decodedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const getDataById = async (id) => {
    try {
      // Make a GET request to the Sawtooth REST API to retrieve the vehicle data
      const response = await axios.get(`http://localhost:8008/state/${id}`);
        
      if (response.data.data && response.data.data.length > 0) {
        // If data is found, parse and return it
        const data = response.data.data[0].data;
        const decodedData = Buffer.from(data, 'base64').toString('utf-8');
        console.log(decodedData)
        return JSON.parse(decodedData);
      } else {
        return null; // Vehicle not found
      }
    } catch (error) {
      throw error; // Handle API request errors as needed
    }
  };


module.exports = {
    sendTransaction,
    getDataById,
    fetchDataById,
}