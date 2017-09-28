const Processor = require('./Processor')
    , Resolver = require('./Resolver')
    , ErrorHandler = require('./ErrorHandler')
    , ImageGenerator = require('./ImageGenerator')
    , config = require('../config/config.json')

class Client {
    constructor(T) {
        this.rawTweet
        this.processor = new Processor()
        this.errorHandler = new ErrorHandler()
        this.imageGenerator = new ImageGenerator()
        this.T = T
    }

    async processTweet(rawTweet, dummy = false) {
        try {
            console.log(rawTweet.text)
            
            let startEnd = await this.processor.processTweet(rawTweet.text)
            let journey = await this.processor.makeJourneyRequest(startEnd)
            let tweetpic = await this.imageGenerator.generateCard(startEnd, JSON.parse(journey))
            !dummy && this.uploadImageToTwitter.call(this, tweetpic, rawTweet, JSON.parse(journey).id)
        } catch (error) {
            console.log(error)
            this.sendMessageToTwitter.call(this, rawTweet, this.errorHandler.getTextResponse(error))
        }
    }

    sendMessageToTwitter(tweet, message) {
    	console.log("posting message to twitter")
	    console.log(message)
        var params = { in_reply_to_status_id: tweet.id_str, status: "@" + tweet.user.screen_name + " " + message }
        this.T.post('statuses/update', params, function (err, data, response) {
            console.log(err)
        })
    }

    uploadImageToTwitter(b64content, tweet, journeyId, error = false) {
        console.log(this)
        this.T.post('media/upload', { media_data: Buffer.from(b64content, 'latin1').toString('base64') }, (err, data, response) => {
            // now we can assign alt text to the media, for use by screen readers and
            // other text-based presentations and interpreters
            var mediaIdStr = data.media_id_string
                , altText = "Journey from the locations you specified"
                , meta_params = {  media_id: mediaIdStr, alt_text: { text: altText } }
                , name = tweet.user.screen_name

            this.T.post('media/metadata/create', meta_params, (err, data, response) => {
                if (!err) {
                    // now we can reference the media and post a tweet (media will attach to the tweet)
                    let statusText = `Here is your journey #getmeto #publictransport @${name}. View it at http://please.scottybeam.me/journeys/${journeyId}`
                    if(error) {
                        statusText = `Sorry :( @${name}`
                    }
                    var params = { in_reply_to_status_id: tweet.id_str, status: statusText, media_ids: [mediaIdStr] }
                    this.T.post('statuses/update', params, function (err, data, response) {
                        console.log(data)
                    })
                }
            })
        })
    }

    async getReady() {
        return new Promise((resolve, reject) => {
            let wait = setInterval(() => {
                console.log("waiting on client ready")
                if(this.isReady()) {
                    resolve()
                    clearTimeout(wait)
                }
            }, 100)
        })
    }

    isReady() {
        return this.processor.isReady()
    }

    apologise(error) {
        return 
    }
}

module.exports = Client
