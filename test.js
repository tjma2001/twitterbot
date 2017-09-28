const processor = require('./lib/Processor')
	, Client = require('./lib/Client')
	, Dummy = require('./lib/Dummy')
	, Twit = require('twit')
	, T = new Twit({
        consumer_key: config.consumer_key
        , consumer_secret: config.consumer_secret
        , access_token: config.access_token
        , access_token_secret: config.access_token_secret
        , timeout_ms: 60 * 1000
    	})
    	, client = new Client(T)
	
Dummy.startDummy(T)
