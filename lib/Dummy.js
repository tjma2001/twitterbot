const Geocode = require('./Geocode')
    , async = require('async')
    , Parser = require('./Parser')
    , Processor = require('./Processor')

module.exports.startDummy = () => {
    var tweet = [ 
        "Bonteheuwel to Cape Town", 
        "Bonteheuwel to Cape Town @TransportMeTo",
        "28 Dissel Road, Bonteheuwel to Grassypark @TransportMeTo"]
    // var startAddress = Geocode.geoCodeAddress('Bonteheuwel').then(result => {
    //     console.log(result)
    // })
    // var endAddress = Geocode.geoCodeAddress('Cape Town').then(result => {
    //     console.log(result)
    // })
    // Parser.parseTweet(tweet[0])
    // Parser.parseTweet(tweet[1])
    // console.log(startAddress)
    Processor.processTweet(tweet[0])
}