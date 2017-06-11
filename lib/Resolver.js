const config = require('../config/config.json')

class Resolver {
    constructor() {

    }

    sendJourneyToClient(client, id) {
        let constructedUrl = `${config.baseUrl}/journey/${id}`
        client.inform(constructedUrl)
    }
}

module.exports = Resolver