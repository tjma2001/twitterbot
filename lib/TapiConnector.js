const request = require('request-promise')
    , config = require('../config/config.json')
    , CLIENT_ID = config.tapi.clientId
    , CLIENT_SECRET = config.tapi.clientSecret

class Tapi {
    constructor() {
        this.token = ""
        /**
         * Get Identity Token
         */
        this.getIdentityToken.apply(this)
        setInterval(this.getIdentityToken.bind(this), 1000 * 60 * 60)
    }

    isReady() {
        return this.token.length > 0
    }

    getIdentityToken() {
        var options = {
            method: "POST",
            headers: "ACCEPT: application/json",
            url: "https://identity.whereismytransport.com/connect/token",
            form: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "client_credentials",
                scope: "transportapi:all"
            }
        };

        request(options, (error, response, body) => {
            this.token = JSON.parse(body).access_token
        });
    }

    async makeJourney (start, end) {
            var body = {
                geometry: {
                    type: "Multipoint",
                    coordinates: [[start.lng, start.lat], [end.lng, end.lat]]
                }
            }
            
            var options = {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "authorization": "Bearer " + this.token
                },
                url: "https://platform.whereismytransport.com/api/journeys",
                body: JSON.stringify(body)
            }
            return request(options)
    }
}

module.exports = Tapi