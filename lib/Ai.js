const ApiAI = require('apiai')
    , uuid = require('uuid/v4')
    , config = require('../config/config.json')

class Ai
{
    constructor(){
        this.app = ApiAI(config.apiAi)
    }

    async makeRequest(requestText) {
        return new Promise((resolve, reject) => {
            let request = this.app.textRequest(requestText, {
                sessionId: uuid()
            })

            request.on('response', response => resolve(response))
            request.on('error', error => reject(error))
            request.end()
        })
    }
}

module.exports = Ai