const { randomBytes, createHash } = require('crypto')
const secp256k1 = require('secp256k1');

const axios = require('axios').default;

const {Secp256k1PrivateKey} = require('sawtooth-sdk-js/signing/secp256k1');
const {CryptoFactory, createContext} = require('sawtooth-sdk-js/signing');
const protobuf = require('sawtooth-sdk-js/protobuf');

//This create a new private key and return hexa version of the key
const createPrivatekey = ()=>{
    const msg = randomBytes(32)

    // generate privKey
    let privKey
    do {
        privKey = randomBytes(32)
    } while (!secp256k1.privateKeyVerify(privKey))

    // get the public key in a compressed format
    const pubKey = secp256k1.publicKeyCreate(privKey)

    // sign the message
    const sigObj = secp256k1.ecdsaSign(msg, privKey)

    // verify the signature
    console.log(secp256k1.ecdsaVerify(sigObj.signature, msg, pubKey))
    // => true
    return privKey.toString('hex')
}


const privateKeyHexStr = createPrivatekey();

//Create Instance of the private key with a internal class
const privateKey = new Secp256k1PrivateKey(Buffer.from(privateKeyHexStr,'hex'));

const context = createContext('secp256k1');

//Create a new signer to sign the payload
const signer = new CryptoFactory(context).newSigner(privateKey);

//Prepare a payload
const payload = "Test ME";
const payloadBytes = Buffer.from(payload);

//Payload -> Transaction -> Transactionlist -> Batch -> BatchList -> Byte -> REST_API

//Prepare the transaction header
const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName:'intkey',
    familyVersion: '1.0',   
    inputs:['1cf126'],
    outputs:['1cf126'],
    signerPublicKey:signer.getPublicKey().asHex(),
    nonce:`${Math.random()}`,
    batcherPublicKey:signer.getPublicKey().asHex(),
    dependencies:[],
    payloadSha512:createHash('sha512').update(payloadBytes).digest('hex')
}).finish()


const transaction = protobuf.Transaction.create({
    header:transactionHeaderBytes,
    headerSignature:signer.sign(transactionHeaderBytes),
    payload:payloadBytes
})

const transactions = [transaction];

const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey:signer.getPublicKey().asHex(),
    transactionIds:transactions.map(t=>t.headerSignature) 
}).finish();

const batch = protobuf.Batch.create({
    header:batchHeaderBytes,
    headerSignature : signer.sign(batchHeaderBytes),
    transactions:transactions
})

const batches = [batch];
const batchListBytes = protobuf.BatchList.encode({
    batches:batches
}).finish();


console.log(batchListBytes.toString())

//Forward 
axios.post('http://localhost:8008/batches',batchListBytes,{
    headers:{
        'Content-Type':'application/octet-stream'
    },
    data:batchListBytes
} ).then((res)=>{
    console.log('here...');
    console.log(res.data);

}).catch((err)=>{
    console.log('errorrrrrrr');
    console.log(err.response)

})