const request = require('request')
    , CLIENT_ID = '81908b61-4f08-49ee-8342-671eaec26cd1'
    , CLIENT_SECRET = 'ZiWvOd9VRclWZsmF/lQVv86SWurgJuJN7yles+wTTSU='

class Tapi {
    constructor() {
        this.token = ""
        /**
         * Get Identity Token
         */
        this.getIdentityToken.apply(this)
        setInterval(this.getIdentityToken.bind(this), 1000 * 60 * 60)
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
            this.token = JSON.parse(body).access_token;
            // subsequent requests go here, using the TOKEN
            console.log('got token')
        });
    }

    makeJourney (start, end) {
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

        request(options, (error, response, body) => {
            console.log(response.statusCode)
            console.log({ 'Journeys' : JSON.parse(body) })
        })
    }
}

module.exports = Tapi