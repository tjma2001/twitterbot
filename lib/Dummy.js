const Geocode = require('./Geocode')
    , async = require('async')
    , fs = require('fs')
    , Parser = require('./Parser')
    , Processor = require('./Processor')
    , Resolver = require('./Resolver')
    , Client = require('./Client')
    , Ai = require('./Ai')

module.exports.startDummy = (T) => {
    var tweet = [ 
        "Bonteheuwel to Cape Town", 
        "Bonteheuwel to Cape Town @TransportMeTo",
        "28 Dissel Road, Bonteheuwel to Grassypark @TransportMeTo"]
        , processor = new Processor()
        , client = new Client(processor, T)
        , ai = new Ai()
        
    async function start () {
        let tweets = await loadTweetsFromFiles()
        
        try { 
            let response = await ai.makeRequest(tweet[0])
            console.log(response)
        } catch (error) {
            console.log(error)
        }


        client.processTweet(tweets[0], true)
        client.processTweet(tweets[1], true)
    }

    async function loadTweetsFromFiles () {
        return new Promise((resolve, reject) => {
            try {
                let tweets = []
                let string = fs.readFileSync('tweets/request1.tweet', 'UTF8')
                let tweet = JSON.parse(string.replace(/(\\r\\n|\\)/gi,""))
                tweets.push(tweet)
                
                string = fs.readFileSync('tweets/request2.tweet', 'UTF8')
                tweet = JSON.parse(string.replace(/(\\r\\n|\\)/gi,""))
                tweets.push(tweet)
                
                resolve(tweets)
            } catch (error) {
                reject(error)
            }
        })
    }

    // let interval = setInterval(() => {
    //     if(client.isReady()) {
    //         console.log("ready")
    //         start()
    //         clearInterval(interval)
    //     }
    // }, 100)
    (async () => {
        let ready = await client.getReady()
        start()
    })()
}