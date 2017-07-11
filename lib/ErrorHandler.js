const ImageGenerator = require('./ImageGenerator')

class ErrorHandler {
    constructor() {
        this.imageGenerator = new ImageGenerator()
    }

    getTextResponse(error) {
        //throw error
        switch(error.code) {
            case errorCodes.ADDRESS_NOT_FOUND : {
                let errorText = `Unable to locate that address, please be more specific.`
                return errorText
            }

            case errorCodes.JOURNEY_EMPTY : {
                let errorText = `We could not find a journey for the addresses that you specified. You could try being more specific with your locations.`
                return errorText
            }

            case errorCodes.INVALID_ADDRESS : {
                let errorText = `We could not find a journey for the address that you specified.`
                return errorText
            }
            default:
                console.log(error)
                return `An Error Occurred. We Are working on a solution`
        }
    }
}

const errorCodes = {
    ADDRESS_NOT_FOUND: "ADDRESS_NOT_FOUND"
    , JOURNEY_EMPTY: "JOURNEY_EMPTY"
    , INVALID_ADDRESS: "INVALID_ADDRESS"
}

module.exports = ErrorHandler
module.exports.errorCodes = errorCodes