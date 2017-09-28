const express = require('express')
    , server = express()
    , Twit = require('twit')
    , BodyParser = require('body-parser')
    , Geocode = require('./lib/Geocode')
    , Dummy = require('./lib/Dummy')
    , Processor = require('./lib/Processor')
    , Client = require('./lib/Client')
    , WebHook = require('./lib/WebHook')
    , config = require('./config/config.json')
    , port = 9006
    , T = new Twit({
        consumer_key: config.consumer_key
        , consumer_secret: config.consumer_secret
        , access_token: config.access_token
        , access_token_secret: config.access_token_secret
        , timeout_ms: 60 * 1000
    })
    , client = new Client(T)
    , myName = 'TransportMeTo'
    , webhook = new WebHook()

const start = () => {
    // Dummy.startDummy(T)
    var stream = T.stream('user', { user: myName})

    stream.on('tweet', function (tweet) {
        console.log("received tweet");
        var nameId = tweet.id_str;
        var username = tweet.user.screen_name;
        var json = JSON.stringify(tweet)
        if(username.indexOf(myName) !== -1) {
            return
        }
        client.processTweet(tweet)
    })

    stream.on('error', err => {
        console.log(err)
    })

}

(async () => {
    let ready = await client.getReady()
    start()
})()

server.use(BodyParser.urlencoded({ extended: false }))
server.use(BodyParser.json())

server.get('/', (req, res) => {
    res.status(200).send("Go Home!")
})

server.post('/webhook/apiairequest', webhook.reverseGeocode.bind(webhook) )

server.listen(port, listen => {
    console.log("server listening on ", port);
})

