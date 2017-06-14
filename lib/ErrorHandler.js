const ImageGenerator = require('./ImageGenerator')

class ErrorHandler {
    constructor() {
        this.imageGenerator = new ImageGenerator()
    }

    getTextResponse(error) {
        //throw error
        switch(error.code) {
            case errorCodes.ADDRESS_NOT_FOUND : {
                let errorText = `
    Unable to locate that address, please be more specific.
                \n
                \n
    Checkout the examples at http://www.getmeto.co.nr/examples`
                return errorText
            }

            case errorCodes.JOURNEY_EMPTY : {
                let errorText = `
    We could not find a journey for the address 
    parameters that you specified. 
      
    You could try being more specific with your 
    start and end locations.
                `
                return errorText
            }

            case errorCodes.INVALID_ADDRESS : {
                let errorText = `
    We could not find a journey for the address parameters
    that you specified. 
    
    Please be sure to type your request like:

               "Bonteheuwel to GrassyPark"
    
    The more specific the better

                          ^_^
                `
                return errorText
            }
            default:
                return `
            An Error Occurred. 
        We Are working on a solution`
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