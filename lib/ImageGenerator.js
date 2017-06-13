const gd = require('node-gd')
    , config = require('../config/config.json')
    , StaticMaps = require('../node_modules/staticmaps/dist/index')

/**
 * Region: Extend Number Library
 */
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

if (typeof (Number.prototype.toDeg) === "undefined") {
    Number.prototype.toDeg = function () {
        return this * (180 / Math.PI);
    }
}
/**
 * EndRegion
 */


class ImageGenerator {
    constructor() {
        this.busImage = gd.createFromPng('assets/bus.png')
        this.railImage = gd.createFromPng('assets/rail.png')
        this.walkingImage = gd.createFromPng('assets/lwalking.png')
        this.shareTaxiImage = gd.createFromPng('assets/minibustaxi.png')
    }

    async createMapImage({ start, end, rawStreets }, journey) {
        return new Promise(async function(journey, resolve, reject) {
            var center = this.middlePoint(start.lng, start.lat, end.lng, end.lat)

            try {
                var options = {
                    width: 800,
                    height: 800,
                    tileUrl: `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${config.mapboxApiKey}`
                };
                let staticMap = new StaticMaps(options)
                
                //add polylines
                this.addLinesToMap(journey, staticMap)

                //add Stops
                this.addStopsToMap(journey, staticMap)

                //add Start and End
                //TODO: add start and end

                let completed = await staticMap.render(center)
                if(completed) {
                    var imagePath = `generated-images/map-${ journey.id }.png`
                    staticMap.image.save(imagePath, _=> {
                        resolve(imagePath)
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }.bind(this, journey))
    }

    createModesView(modes) {

    }

    async generateCard(startEnd, journey) {
        return new Promise(async (resolve, reject) => {
            var png = await this.createMapImage(startEnd, journey)
                , map = gd.createFromPng(png)
                , img = gd.createSync(800, 1200)
                , modes = this.generateModesView(journey)

            modes.copy(img, 0, 800, 0, 0, 800, 300)
            map.copy(img, 0, 0, 0,0, 800, 800)
            
            img.colorAllocate(128, 255, 125)

            var txtColor = img.colorAllocate(255, 0, 255)
            var rectColor = img.colorAllocate(0, 255, 0)
            
            var fontPath = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
            var text = this.generateWayPointText(journey)

            img.filledRectangle(0, 950, 800, 1150, rectColor)
            img.stringFT(txtColor, fontPath, 25, 0, 10, 950, text)
            
            let cardAddress = `generated-images/${journey.id}-output.png`
            //let cardAddress = `generated-images/output.png`
            resolve(img.pngPtr())
            img.savePng(cardAddress, 1, function(err) {
                if(err) {
                    reject(err)
                } else {
                    //resolve(`generated-images/${journey.id}-output.png`)
                }
            })
            
            // Destroy image to clean memory 
            img.destroy()
        })
    }

    async generateErrorCard(text) {
        var img = gd.createSync(600, 800);
        
        // Set background color 
        img.colorAllocate(128, 255, 125);
        

        // Set text color 
        var txtColor = img.colorAllocate(255, 0, 255);
        
        // Set full path to font file 
        var fontPath = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
        
        // Render string in image 
        img.stringFT(txtColor, fontPath, 18, 0, 10, 60, text);
        
        // Write image buffer to disk 
        img.savePng('output.png', 1, function(err) {
            if(err) {
                throw err;
            }
        });
        
        // Destroy image to clean memory 
        img.destroy();
    }

    addStopsToMap(journey, map) {
        let itinerary = journey.itineraries[0]
        let legs = itinerary.legs
        var marker = {
            img: __dirname + '/../assets/icon.png', // can also be a URL
            offsetX: 6,
            offsetY: 12,
            width: 24,
            height: 24
        }
        legs.forEach((leg, index) => {
            leg.waypoints.forEach(waypoint => {
                if(leg.line) {
                    marker.coord = [...waypoint.stop.geometry.coordinates]
                }
                if(waypoint.stop) {
                    marker.coord = [...waypoint.stop.geometry.coordinates] 
                    map.addMarker(marker)
                }
            })
        })
    }

    addLinesToMap(journey, map) {
        let itinerary = journey.itineraries[0]
        let legs = itinerary.legs
        
        legs.forEach(leg => {
            let colour = "#000000"
            if(leg.line) {
                colour = leg.line.colour.slice(0, -2)
            }
            var line = {
                coords: [...leg.geometry.coordinates],
                color: colour,
                width: 4
            }
            map.addLine(line)
        })
        
    }

    generateModesView(journey) {
        let itinerary = journey.itineraries[0]
            , legs = itinerary.legs
            , images = []
            , modesView

        legs.forEach(leg => {
            switch(leg.type) {
                case "Walking" : {
                    console.log("Do the walking")
                    images.push('walking')
                    break
                }
                case "Transit" : {
                    console.log("here")
                    switch(leg.line.mode) {
                        case "Rail" : {
                            console.log("Do the train")
                            images.push('rail')
                            break
                        }
                        case "ShareTaxi" : {
                            console.log("Do the taxi")
                            images.push('shareTaxi')
                            break
                        }
                        case "Bus" : {
                            console.log("Do the bus")
                            images.push('bus')
                            break
                        }
                        default : {
                            console.log(`Don't understand mode: ${leg.line.mode}`)
                            break
                        }
                    }
                }
                default: {
                    console.log(`A leg type was given that is not understood`)
                    break
                }
            }
        })
        
        return this.generateImageFromImages(images)
    }
    
    generateImageFromImages(images) {
        let length = images.length
            , genImage = gd.createSync(800, 300)
        console.log(genImage)
        images.forEach((iimage, index) => {
            var image
            console.log(iimage)
            switch(iimage) {
                case "bus" : {
                    image = this.busImage
                    break
                }
                case "rail" : {
                    image = this.railImage
                    break
                }
                case "walking" : {
                    console.log("using walking image")
                    image = this.walkingImage
                    break
                }
                case "shareTaxi" : {
                    image = this.shareTaxiImage
                    break
                }
                default : {
                    console.log('using nothing')
                }
            }
            console.log(index)
            image.copyResized(genImage, (105 * index), 10, 0, 0, 100, 100, 512, 512)
        })
        return genImage
    }

    generateWayPointText(journey) {
        let itinerary = journey.itineraries[0]
            , legs = itinerary.legs
            , lastWayPoints = legs[legs.length -1].waypoints
        let text = `
    Journey start at: ${legs[0].waypoints[0].arrivalTime}\n
    Journey end at: ${lastWayPoints[lastWayPoints.length - 1].arrivalTime}
        `
        return text
    }

    middlePoint(lat1, lng1, lat2, lng2) {
        //-- Longitude difference
        var dLng = (lng2 - lng1).toRad();

        //-- Convert to radians
        lat1 = lat1.toRad();
        lat2 = lat2.toRad();
        lng1 = lng1.toRad();

        var bX = Math.cos(lat2) * Math.cos(dLng);
        var bY = Math.cos(lat2) * Math.sin(dLng);
        var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
        var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

        //-- Return result
        return [lat3.toDeg(), lng3.toDeg()];
    }
}

module.exports = ImageGenerator