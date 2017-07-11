const processor = require('./lib/Processor')
	, Client = require('./lib/Client')
	, Dummy = require('./lib/Dummy')
	, Twit = require('twit')
	, T = new Twit({
        	consumer_key: 'm3y6qK05PNWHTqmgzGOlxQ5Rl'
        	, consumer_secret: 'rbDtPmRyJmCUyU8MdSncvwYZvYEdogPUQoBcV2sGT0P52q2QUx'
        	, access_token: '871468890332823553-ArEpH5MhtlfhoWXr0Va6A5Vt6dqpkN7'
        	, access_token_secret: 'ti573MpQSEatmGbCUaAhhnXmtghIxsggYrsMdhdqLed8n'
        	, timeout_ms: 60 * 1000
    	})
    	, client = new Client(T)
	
Dummy.startDummy(T)
