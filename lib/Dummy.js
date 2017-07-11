const Geocode = require('./Geocode')
    , async = require('async')
    , fs = require('fs')
    , Parser = require('./Parser')
    , Processor = require('./Processor')
    , Resolver = require('./Resolver')
    , Client = require('./Client')
    , ImageGenerator = require('./ImageGenerator')
    , Ai = require('./Ai')

module.exports.startDummy = (T) => {
    var tweet = [ 
        "Bonteheuwel to Cape Town", 
        "Bonteheuwel to Cape Town @TransportMeTo",
        "28 Dissel Road, Bonteheuwel to Grassypark @TransportMeTo"]
        , processor = new Processor()
        , client = new Client(processor, T)
        , ai = new Ai()
        , imageGenerator = new ImageGenerator()
        
    async function start () {
        let tweets = await loadTweetsFromFiles()
        try {
            client.processTweet(tweets[0], true)
            client.processTweet(tweets[1], true)
            client.processTweet(tweets[2], true)
        } catch (e){
            console.error("rejected")
            console.error(e)
        }
        
        
    }

    async function loadTweetsFromFiles () {
        return new Promise((resolve, reject) => {
            try {
                let tweets = []
                let files = fs.readdirSync('tweets')
                files.forEach(file => {
                    console.log(file)
                    let string = fs.readFileSync(`tweets/${file}`, 'UTF8')
                    let tweet = JSON.parse(string.replace(/(\\r\\n|\\)/gi,""))
                    tweets.push(tweet)
                })
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
