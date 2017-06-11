const Processor = require('./Processor')
    , Resolver = require('./Resolver')

class Client {
    constructor(processor) {
        this.rawTweet
        this.processor = processor
    }

    createClientFromTweet(tweet) {
        this.rawTweet = tweet
        return this
    }

    async processTweet() {
        try {
            let startEnd = await this.processor.processTweet(this.rawTweet.text)
            //let journey = await this.processor.makeJourneyRequest(startEnd)
            console.log(journey)
        } catch (error) {
            this.apologise(error)
        }
    }

    isReady() {
        return this.processor.isReady()
    }

    apologise(error) {
        console.log('GERROR: ', error)
    }

    inform(id) {
        let constructedUrl = `${config.baseUrl}/journey/${id}`
        this.sendJourneyToUser(constructedUrl)
    }

    sendJourneyToUser(url) {
        console.log(`sending ${url} to client`)
    }

    generateTweetPic(content) {

    }
}

module.exports = Client