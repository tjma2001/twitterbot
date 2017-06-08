const Parser = require('./Parser')
    , Geocode = require('./Geocode')
    , tapiConnector = new (require('./TapiConnector'))()

const _validateParsedTweet = async parsedTweet => {
    let messages = Array.from(parsedTweet)
    if(messages.length == 2) {
        let start = await _geocodeAddress(messages[0])
        let end = await _geocodeAddress(messages[1])

        return {start: start, end: end}
    } else {
        console.log('error')
    }
    return false
}

const _geocodeAddress = async address => {
    return new Promise((resolve, reject) => {
        Geocode.geoCodeAddress(address).then(result => {
            resolve(result)
            console.log(result)
        }).catch(error => {
            reject(error)
            console.error(error)
        }) 
    })
}

module.exports.processTweet = tweet => {
    _validateParsedTweet(Parser.parseTweet(tweet)).then(result => {
        console.log('result: ', result)
        tapiConnector.makeJourney(
            result.start.results[0].geometry.location
            , result.end.results[0].geometry.location
        )
    })
}