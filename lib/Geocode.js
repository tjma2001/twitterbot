const request = require('request')
    , googleApiKey = "AIzaSyDGLOfR-nzN4HJb4t2UapzHwgxmDvuYUk4"

async function geoCodeAddress(address, callback) {
    let urlString = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`
    return new Promise((resolve, reject) => {
        request.get(urlString, (error, result) => {
            if(!error) {
                let parsedBody = JSON.parse(result.body)
                //console.log(result)
                resolve(parsedBody)
            } else {
                //console.log(result)
                reject(error)
            }
        })
    })
}
module.exports.geoCodeAddress = async (address) => {
    return await geoCodeAddress(address)
}