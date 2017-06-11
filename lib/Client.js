const Processor = require('./Processor')
    , Resolver = require('./Resolver')
    , ErrorHandler = require('./ErrorHandler')
    , ImageGenerator = require('./ImageGenerator')

class Client {
    constructor(processor) {
        this.rawTweet
        this.processor = processor
        this.errorHandler = new ErrorHandler()
        this.imageGenerator = new ImageGenerator()
    }

    createClientFromTweet(tweet) {
        this.rawTweet = tweet
        return this
    }

    async processTweet() {
        try {
            let startEnd = await this.processor.processTweet(this.rawTweet.text)
            let journey = await this.processor.makeJourneyRequest(startEnd)
            let tweetpic = await this.imageGenerator.generateCard(startEnd, JSON.parse(journey))
            console.log(journey)
        } catch (error) {
            this.apologise(error)
        }
    }

    isReady() {
        return this.processor.isReady()
    }

    apologise(error) {
        let message = this.errorHandler.getFormattedResponse(error)
        console.log(message)
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