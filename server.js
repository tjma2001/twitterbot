const express = require('express')
    , server = express()
    , Twit = require('twit')
    , Geocode = require('./lib/Geocode')
    , Dummy = require('./lib/Dummy')
    , port = 9006
    , T = new Twit({
        consumer_key: 'm3y6qK05PNWHTqmgzGOlxQ5Rl'
        , consumer_secret: 'rbDtPmRyJmCUyU8MdSncvwYZvYEdogPUQoBcV2sGT0P52q2QUx'
        , access_token: '871468890332823553-ArEpH5MhtlfhoWXr0Va6A5Vt6dqpkN7'
        , access_token_secret: 'ti573MpQSEatmGbCUaAhhnXmtghIxsggYrsMdhdqLed8n'
        , timeout_ms: 60 * 1000
    })
    , myName = 'TransportMeTo'

console.log(process.version)
Dummy.startDummy(T)

var stream = T.stream('user', { user: 'tjma2001'})

stream.on('tweet', function (tweet) {
  console.log("received tweet");
  var nameId = tweet.id_str;
  var username = tweet.user.screen_name;
  var json = JSON.stringify(tweet)
  if(username.indexOf(myName) !== -1) {
      return
  }
  T.post('statuses/update', { in_reply_to_status_id: nameId, status: `Hello there @${username}`}, (err, data, response) => {
      if(!err) {
          console.log('reply sent')
      } else {
          console.log('reply failed')
      }
  })
})

stream.on('error', err => {
    console.log(err)
})

server.get('/', (req, res) => {
    console.log(req);
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

