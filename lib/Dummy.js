const Geocode = require('./Geocode')
    , async = require('async')
    , fs = require('fs')
    , Parser = require('./Parser')
    , Processor = require('./Processor')
    , Resolver = require('./Resolver')
    , Client = require('./Client')

module.exports.startDummy = () => {
    var tweet = [ 
        "Bonteheuwel to Cape Town", 
        "Bonteheuwel to Cape Town @TransportMeTo",
        "28 Dissel Road, Bonteheuwel to Grassypark @TransportMeTo"]
        , processor = new Processor()
        , client = new Client(processor)
        
    async function start () {
        let tweets = await loadTweetsFromFiles()
        client.createClientFromTweet(tweets[0]).processTweet()
    }

    async function loadTweetsFromFiles () {
        return new Promise((resolve, reject) => {
            try {
                let tweets = []
                let string = fs.readFileSync('tweets/request1.tweet', 'UTF8')
                let tweet = JSON.parse(string.replace(/(\\r\\n|\\)/gi,""))
                tweets.push(tweet)
                resolve(tweets)
            } catch (error) {
                reject(error)
            }
        })
    }

    let interval = setInterval(() => {
        console.log("not ready")
        if(client.isReady()) {
            console.log("ready")
            start()
            clearInterval(interval)
        }
    }, 100)
}