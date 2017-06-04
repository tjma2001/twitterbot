const express = require('express')
    , server = express()
    , Twit = require('twit')
    , port = 9006
    , T = new Twit({
        consumer_key: 'v0GIC5fnDVWiepjfHdkPcCyNY'
        , consumer_secret: 'WgWMVvYeClLXobm7H2n0s6N1RJPQ9niyNIOTAN3ZyPKfGusqbu'
        , access_token: '417938258-DVOe1FCBMQWgooKDplOVd8gYy88XJu788jPhwXj7'
        , access_token_secret: 'ePOIEIN5cyz6X1uzp6OKAKGZKbUymh6Xa3jm1k429VtIw'
        , timeout_ms: 60 * 1000
    })


var stream = T.stream('user', { user: 'TransportMeTo'})

stream.on('tweet', function (tweet) {
  console.log("received tweet");
  var nameId = tweet.id_str;
  var username = tweet.user.screen_name;
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

