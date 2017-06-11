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
        console.log(config)
        
    }

    async createMapImage({ start, end, rawStreets }, journey) {
        return new Promise(async function(journey, resolve, reject) {
            var path = this.getPathFromGeometies(this.getPointsFromJourney(journey))
                , center = this.middlePoint(start.lng, start.lat, end.lng, end.lat)
                , params = {
                //center: `${center[0]}, ${center[1]}`,
                // zoom: 15,
                size: '1024x768',
                maptype: 'roadmap',
                markers: [
                    {
                        location: `${ rawStreets[0] }`,
                        label   : 'Start',
                        color   : 'green',
                        shadow  : true
                    },
                    {
                        location: `${ rawStreets[1] }`,
                        label   : 'End',
                        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
                    }
                ],
                style: [
                    {
                        feature: 'road',
                        element: 'all',
                        rules: {
                            hue: '0x00ff00'
                        }
                    }
                ],
                path: path
            }

            try {
                var options = {
                    width: 800,
                    height: 1000,
                    tileUrl: `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${config.mapboxApiKey}`
                };
                let staticMap = new StaticMaps(options)
                
                //add polylines
                this.getLinesFromIninerary(journey, staticMap)

                //add Stops


                //add Start and End

                let completed = await staticMap.render(center)
                if(completed) {
                    staticMap.image.save('center.png', _=> {
                        console.log('map saved')
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
        // return new Promise(async (resolve, reject) => {
            var png = await this.createMapImage(startEnd, journey)
            var map = gd.createFromPngPtr(png)
            var bus = gd.createFromPng('assets/bus.png')
            var img = gd.createSync(800, 1200)

            bus.copyResized(img, 100, 1000,0,0, 100, 100, 512, 512)
            map.copy(img, 0, 0, 0,0, 800, 1000)

            // Set background color 
            img.colorAllocate(128, 255, 125);

            // Set text color 
            var txtColor = img.colorAllocate(255, 0, 255);
            
            // Set full path to font file 
            var fontPath = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
            
            var text = "test"
            // Render string in image 
            img.stringFT(txtColor, fontPath, 24, 0, 10, 60, text);
            
            // Write image buffer to disk 
            // let cardAddress = `generated-images/${journey.id}-output.png`
            let cardAddress = `generated-images/output.png`
            img.savePng(cardAddress, 1, function(err) {
                if(err) {
                    throw err
                } else {
                    return `generated-images/${journey.id}-output.png`
                }
            });
            
            // Destroy image to clean memory 
            img.destroy();
        // })
        
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

    addStopsToMap(jouney, map) {

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

    getPointsFromJourney(journey) {
        let itinerary = journey.itineraries[0]
        let legs = itinerary.legs
        let geometries = []
        //let 
        legs.forEach(leg => {
            let line = leg.geometry.coordinates.map(point => `${point[0]},${point[1]}`)
            geometries.push(line)
        })
        return geometries
    }

    getPathFromGeometies(geometries) {
        // path: [
                //     {
                //         color: '0x0000ff',
                //         weight: '5',
                //         points: [
                //             '41.139817,-77.454439',
                //             '41.138621,-77.451596'
                //         ]
                //     }
                // ]
        let path = [];
        geometries.forEach(geometry => {
            path.push({
                color: '0x0000ff',
                weight: '5',
                points: [...geometry]
            })
        })
        return path
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