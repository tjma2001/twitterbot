const ImageGenerator = require('./ImageGenerator')

class ErrorHandler {
    constructor() {
        this.ADDRESS_NOT_FOUND = "ADDRESS_NOT_FOUND"


        this.imageGenerator = new ImageGenerator()
    }

    getFormattedResponse(error) {
        if(error.code.indexOf(this.ADDRESS_NOT_FOUND) !== -1) {
            let errorText = `
                Unable to figure out that address, \n
                please be more clear.\n
                \n
                \n
                Checkout the examples at \n
                http://www.eztaxi.co.nr/exmaples`
            this.imageGenerator.generateErrorCard(errorText)
            return errorText
        }
    }
}

module.exports = ErrorHandler