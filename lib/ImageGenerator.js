const gd = require('node-gd')
    , Jimp = require('jimp')
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
                    staticMap.image.image.getBuffer(Jimp.MIME_PNG, (err, pngBuffer) => {
                        resolve(pngBuffer)
                    })
                    
                    // staticMap.image.save(imagePath, _=> {
                    // //    resolve(imagePath)
                    // // console.log(_)
                    // })
                }
            } catch (error) {
                console.log(error)
            }
        }.bind(this, journey))
    }

    async generateCard(startEnd, journey) {
        return new Promise(async (resolve, reject) => {
            var png = await this.createMapImage(startEnd, journey)
                , img = gd.createTrueColorSync(800, 1100)
                , map = gd.createFromPngPtr(png)
                , modes = this.generateModesView(journey)
                , tBgColor = gd.trueColorAlpha(255, 255, 255, 127);
                
            img.alphaBlending(0)
            img.saveAlpha(1)
            img.filledRectangle(0, 0, 800, 1200, tBgColor)
            img.alphaBlending(1)
            img.saveAlpha(1)

            var txtColor = gd.trueColor(255, 255, 255)
                , textBgColor = gd.trueColor(0, 0, 0)
                , modeColor = 808080
            
            var fontPath = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
            var text = this.generateWayPointText(journey)
            
            img.filledRectangle(0, 800, 850, 925, modeColor)
            modes.copy(img, 0, 800, 0, 0, 800, 300)
            map.copy(img, 0, 0, 0, 0, 800, 800)
            
            img.filledRectangle(0, 925, 800, 1200, textBgColor)
            img.stringFT(txtColor, fontPath, 25, 0, 10, 950, text)

            let cardAddress = `generated-images/${journey.id}-output.png`
            //cardAddress = `generated-images/output.png`
            resolve(img.pngPtr())
            img.savePng(cardAddress, 1, function(err) {
                if(err) {
                    reject(err)
                } else {
                    //resolve(`generated-images/${journey.id}-output.png`)
                }
            })
            img.destroy()
        })
    }

    addStopsToMap(journey, map) {
    	try {
            let itinerary = journey.itineraries[0]
            let legs = itinerary.legs
            var marker = {
                img: __dirname + '/../assets/icon.png',
            	offsetX: 6,
            	offsetY: 8,
                width: 24,
                height: 24
            }
            legs.forEach((leg, index) => {
                leg.waypoints.forEach(waypoint => {
                    if(leg.line) {
		        if(waypoint.stop) {
		            marker.coord = [...waypoint.stop.geometry.coordinates]
		        }
		        if(waypoint.hail) {
		            marker.coord = [...waypoint.hail.geometry.coordinates]
		        }
                    }
                    if(waypoint.stop) {
                        marker.coord = [...waypoint.stop.geometry.coordinates] 
                        map.addMarker(marker)
                    }
                })
            })
        } catch(exception) {
            throw exception 
        }
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
                width: 8
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
                    images.push('walking')
                    break
                }
                case "Transit" : {
                    switch(leg.line.mode) {
                        case "Rail" : {
                            images.push('rail')
                            break
                        }
                        case "ShareTaxi" : {
                            images.push('shareTaxi')
                            break
                        }
                        case "Bus" : {
                            images.push('bus')
                            break
                        }
                        default : {
                            console.log("nothing")
                            break
                        }
                    }
                    break
                }
                default: {
                    console.log(`A leg type was given that is not understood`, leg.type)
                    break
                }
            }
        })
        
        return this.generateImageFromImages(images)
    }
    
    generateImageFromImages(images) {
        let length = images.length
            , genImage = gd.createSync(800, 300)
            , tBgColor = gd.trueColorAlpha(255, 0, 0, 63)
            
        genImage.alphaBlending(0)
        genImage.saveAlpha(1)
        genImage.filledRectangle(0, 0, 800, 300, tBgColor)

        images.forEach((iimage, index) => {
            var image
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
                    image = this.walkingImage
                    break
                }
                case "shareTaxi" : {
                    image = this.shareTaxiImage
                    break
                }
                default : {
                    break
                }
            }
            image.copyResized(genImage, (105 * index), 10, 0, 0, 100, 100, 512, 512)
        })
        return genImage
    }

    generateWayPointText(journey) {
        let itinerary = journey.itineraries[0]
            , legs = itinerary.legs
            , lastWayPoints = legs[legs.length -1].waypoints
            , startDate = (new Date(legs[0].waypoints[0].arrivalTime)).toLocaleString()
            , endDate = (new Date(lastWayPoints[lastWayPoints.length - 1].arrivalTime)).toLocaleString()

        return `
  Start at: ${ startDate }
  End at:   ${ endDate }`
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
