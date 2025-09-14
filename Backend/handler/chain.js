const { TransactionHandler } = require('sawtooth-sdk-js/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk-js/processor/exceptions')
const { family, actions } = require('../constants');
const { hash } = require('../utils');



class ChainHandler extends TransactionHandler {
    constructor() {
        super(family.name, [family.version], [family.namespace])
    }

    async apply(transactionProcessRequest, context) {
        let payload;
        try {
            payload = JSON.parse(transactionProcessRequest.payload)
        } catch (error) {
            throw new InvalidTransaction('Errored while decoding payload' + error.message)
        }
        if (!payload.action) {
            throw new InvalidTransaction('Invalid Action Type')
        }
        const address = family.namespace + hash(payload.id).slice(-64);
        const data = await context.getState([address]);
        switch (payload.action) {
            
            case actions.createHarvest:
                    if(data && data[address] && data[address].length !== 0){
                        throw new InvalidTransaction('Existing harvest found');
                    }
                    return context.setState({
                        [address]: payload.id
                    }).then((addresses) => {
                        if (addresses.length === 0) {
                            throw new InvalidTransaction('State Error!. Nothing got updated')
                        }
                    })
            case actions.createCollection:
                    if(data && data[address] && data[address].length !== 0){
                        throw new InvalidTransaction('Existing Collection found');
                    }
                    return context.setState({
                        [address]: payload.id
                    }).then((addresses) => {
                        if (addresses.length === 0) {
                            throw new InvalidTransaction('State Error!. Nothing got updated')
                        }
                    })
            case actions.createDistribution:
                    if(data && data[address] && data[address].length !== 0){
                        throw new InvalidTransaction('Existing Distribution found');
                    }
                    return context.setState({
                        [address]: payload.id
                    }).then((addresses) => {
                        if (addresses.length === 0) {
                            throw new InvalidTransaction('State Error!. Nothing got updated')
                        }
                    })
            case actions.receiveDelivery:
                    if(data && data[address] && data[address].length !== 0){
                        throw new InvalidTransaction('Existing Delivery found');
                    }
                    return context.setState({
                        [address]: payload.id
                    }).then((addresses) => {
                        if (addresses.length === 0) {
                            throw new InvalidTransaction('State Error!. Nothing got updated')
                        }
                    })

            case actions.predictPrice:
                    if(data && data[address] && data[address].length !== 0){
                        throw new InvalidTransaction('Existing Price Prediction found');
                    }
                    return context.setState({
                        [address]: payload.id
                    }).then((addresses) => {
                        if (addresses.length === 0) {
                            throw new InvalidTransaction('State Error!. Nothing got updated')
                        }
                    })

            case actions.predictDemand:
                    if(data && data[address] && data[address].length !== 0){
                        throw new InvalidTransaction('Existing Demand Prediction found');
                    }
                    return context.setState({
                        [address]: payload.id
                    }).then((addresses) => {
                        if (addresses.length === 0) {
                            throw new InvalidTransaction('State Error!. Nothing got updated')
                        }
                    })


            default:
                throw new InvalidTransaction('Invalid Action Type')
        }
    }

}

module.exports = ChainHandler