const ImageGenerator = require('./ImageGenerator')

class ErrorHandler {
    constructor() {
        this.ADDRESS_NOT_FOUND = "ADDRESS_NOT_FOUND"


        this.imageGenerator = new ImageGenerator()
    }

    getFormattedResponse(error) {
        throw error
        // if(error.code.indexOf(this.ADDRESS_NOT_FOUND) !== -1) {
        //     let errorText = `
        //         Unable to locate that address, \n
        //         please be more specific.\n
        //         \n
        //         \n
        //         Checkout the examples at \n
        //         http://www.eztaxi.co.nr/examples`
        //     this.imageGenerator.generateErrorCard(errorText)
        //     return errorText
        // }
    }
}

module.exports = ErrorHandler