const Processor = require('./Processor')
    , Resolver = require('./Resolver')
    , ErrorHandler = require('./ErrorHandler')
    , ImageGenerator = require('./ImageGenerator')

class Client {
    constructor(processor, T) {
        this.rawTweet
        this.processor = processor
        this.errorHandler = new ErrorHandler()
        this.imageGenerator = new ImageGenerator()
        this.T = T
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
            let uploadImageToTwitter = this.uploadImageToTwitter(tweetpic)
            //console.log(journey)
        } catch (error) {
            this.apologise(error)
        }
    }

    uploadImageToTwitter(b64content) {
        this.T.post('media/upload', { media_data: Buffer.from(b64content, 'latin1').toString('base64') }, (err, data, response) => {
            // now we can assign alt text to the media, for use by screen readers and
            // other text-based presentations and interpreters
            var mediaIdStr = data.media_id_string
            var altText = "Journey from the locations you specified"
            var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

            this.T.post('media/metadata/create', meta_params, (err, data, response) => {
                if (!err) {
                    // now we can reference the media and post a tweet (media will attach to the tweet)
                    var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }

                    this.T.post('statuses/update', params, function (err, data, response) {
                        console.log(data)
                    })
                }
            })
        })
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