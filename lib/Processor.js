const Parser = require('./Parser')
    , Geocode = require('./Geocode')
    , Tapi = require('./TapiConnector')
    , { errorCodes } = require('./ErrorHandler')
    , Ai = require('./Ai')
    , Fs = require('fs')

class Processor { 
    constructor() {
        this.tapiConnector = new Tapi()
        this.ai = new Ai()
    }

    isReady () {
        return this.tapiConnector.isReady()
    }
    
    async _validateParsedTweet (parsedTweet) {
        let messages = Array.from(parsedTweet)
        if(messages.length == 2) {
            let start, end
            try {
                [start,end] = await Promise.all(
                    [Geocode.geoCodeAddress(messages[0])
                    , Geocode.geoCodeAddress(messages[1])])
                    
                return Promise.resolve({start: start, end: end, rawStreets: [...messages]})
            } catch (error) {
                console.log("Error occurred")
                return Promise.reject(error)
            }
        } else {
            return Promise.reject({code: errorCodes.INVALID_ADDRESS })
        }
    }

    async makeJourneyRequest({start, end}) {
        try {
            let journey = await this.tapiConnector.makeJourney(start, end)
            // console.log(journey)
            Fs.writeFile('../test', journey, (err, result) => {
                console.log(err)
                console.log(result)
            })
            this.validateJourney(JSON.parse(journey))
            return journey
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async processTweet (tweet) {
        try {
            let startEnd = await this.ai.makeRequest(Parser.removeMentions(tweet))

            if(startEnd.result.fulfillment.data) {
                let start = startEnd.result.fulfillment.data.locationA
                let end = startEnd.result.fulfillment.data.locationB
                let rawStreets = [
                    startEnd.result.fulfillment.data.rawLocA,
                    startEnd.result.fulfillment.data.rawLocB
                ]
                return { start, end, rawStreets}
            } else {
                return Promise.reject(errorCodes.INVALID_ADDRESS)
            }
        } catch(error) {
            return Promise.reject(errorCodes.INVALID_ADDRESS)
        }     
    }

    validateJourney(journey) {
        if(journey.itineraries.length === 0)
            throw { code: errorCodes.JOURNEY_EMPTY }
    }
}

module.exports = Processor
