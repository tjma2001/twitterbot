'use strict';
const http = require('http')
    , request = require('request')
    , Geocode = require('./Geocode')

class Webhook
{
    async reverseGeocode(req, res ) {
        //console.log(req)
        //console.log(this)
        console.log("webhook received")
        let locationA = await Geocode.geoCodeAddress(this.collapse(req.body.result.parameters.location))
            , locationB = await Geocode.geoCodeAddress(this.collapse(req.body.result.parameters.location1))

        var output = "got result"
        var data = { 
            "locationA" : locationA,
            "locationB" : locationB,
            "rawLocA"   : this.collapse(req.body.result.parameters.location),
            "rawLocB"   : this.collapse(req.body.result.parameters.location1)
        }
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify({
            'speech': output,
            'displayText': output,
            'data': data
        }))
    }

    collapse (params) {
        let collapsedString = ""
        Array.from(params).forEach(param => {
            if(typeof(param) === "string") {
                collapsedString += " " + param
            }
            if(param['street-address']) {
                collapsedString += ", " + param['street-address']
            }
            if(param['city']) {
                collapsedString += ", " + param['city']
            }
            if(param['country']) {
                collapsedString += ", " + param['country']
            }
        })
        return collapsedString.trim()
    }
}

module.exports = Webhook;