const request = require('request-promise')
    , googleApiKey = "AIzaSyDGLOfR-nzN4HJb4t2UapzHwgxmDvuYUk4"

async function geoCodeAddress(address, callback) {
    let urlString = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`
    try{
        let body = await request.get(urlString)
        let parsedBody = JSON.parse(body)
        if(parsedBody.status && parsedBody.status.indexOf("ZERO_RESULTS") !== -1) {
            return Promise.reject({code: 'ADDRESS_NOT_FOUND'})
        }
        try { 
            let location = parsedBody.results[0].geometry.location
            return location
        } catch (error) {
            return { code: 'ADDRESS_NOT_FOUND' }
        }
    } catch(error) {
        console.log('error received')
        throw error
    }
}

module.exports.geoCodeAddress = geoCodeAddress