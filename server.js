const express = require('express')
    , server = express()
    , Twit = require('twit')
    , Geocode = require('./lib/Geocode')
    , Dummy = require('./lib/Dummy')
    , Processor = require('./lib/Processor')
    , Client = require('./lib/Client')
    , port = 9006
    , T = new Twit({
        consumer_key: 'm3y6qK05PNWHTqmgzGOlxQ5Rl'
        , consumer_secret: 'rbDtPmRyJmCUyU8MdSncvwYZvYEdogPUQoBcV2sGT0P52q2QUx'
        , access_token: '871468890332823553-ArEpH5MhtlfhoWXr0Va6A5Vt6dqpkN7'
        , access_token_secret: 'ti573MpQSEatmGbCUaAhhnXmtghIxsggYrsMdhdqLed8n'
        , timeout_ms: 60 * 1000
    })
    , processor = new Processor()
    , client = new Client(processor, T)
    , myName = 'TransportMeTo'

const start = () => {
    Dummy.startDummy(T)
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



server.get('/', (req, res) => {
    res.status(200).send("Got Home.")
})

server.get('/webhooks/twitter', (req,res) => {
    console.log(req);
})

server.post('/webhooks/twitter', (req,res) => {
    console.log(req);
})

server.listen(port, listen => {
    console.log("server listening on ", port);
})

