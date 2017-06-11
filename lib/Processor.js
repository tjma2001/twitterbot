const Parser = require('./Parser')
    , Geocode = require('./Geocode')
    , Tapi = require('./TapiConnector')

class Processor { 
    constructor() {
        this.tapiConnector = new Tapi()
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
                    
                return {start: start, end: end, rawStreets: [...messages]}
            } catch (error) {
                console.log("Error occurred")
                return Promise.reject(error)
            }
        } else {
            console.log('error')
        }
    }

    async makeJourneyRequest({start, end}) {
        try {
            let journey = await this.tapiConnector.makeJourney(start, end)
            return journey
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async processTweet (tweet) {
        try {
            let { start, end, rawStreets } = await this._validateParsedTweet(Parser.parseTweet(tweet))

            return {start, end, rawStreets}
        } catch(error) {
            return Promise.reject(error)
        }     
    }
}

module.exports = Processor
