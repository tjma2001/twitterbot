const ApiAI = require('apiai')
    , uuid = require('uuid/v4')

class Ai
{
    constructor(){
        this.app = ApiAI("7b9f76ae895a4625a659295ab8eeaae5")
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