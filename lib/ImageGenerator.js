const gd = require('node-gd')
    , GoogleMapsApi = require('googlemaps')
    , config = require('../config/config.json')

class ImageGenerator {
    constructor() {
        console.log(config)
        this.gmApi = new GoogleMapsApi(config.googleConf)
    }

    async createMapImage(journey) {
        return new Promise((resolve, reject) => { 
            var params = {
                center: '444 W Main St Lock Haven PA',
                zoom: 15,
                size: '500x400',
                maptype: 'roadmap',
                markers: [
                    {
                        location: '300 W Main St Lock Haven, PA',
                        label   : 'A',
                        color   : 'green',
                        shadow  : true
                    },
                    {
                        location: '444 W Main St Lock Haven, PA',
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
                path: [
                    {
                        color: '0x0000ff',
                        weight: '5',
                        points: [
                            '41.139817,-77.454439',
                            '41.138621,-77.451596'
                        ]
                    }
                ]
            };
            this.gmApi.staticMap(params); // return static map URL
            this.gmApi.staticMap(params, function(err, binaryImage) {
            // fetch asynchronously the binary image
                if(err) {
                    console.error('error creating image')
                    reject(err)
                } else {
                    var buffer = new Buffer(binaryImage, "binary");
                    console.log(buffer);
                    resolve(buffer)
                }
            })
        })
    }

    createModesView(modes) {

    }

    async generateCard(journey) {
        return new Promise(async (resolve, reject) => {
            var png = await this.createMapImage()
            var map = gd.createFromPngPtr(png)
            var bus = gd.createFromPng('assets/bus.png')

            this.createMapImage()
            var img = gd.createSync(600, 800)

            bus.copyResized(img, 100, 600,0,0, 100, 100, 512, 512)
            map.copyResized(img, 0, 0, 0,0, 600, 600, 512, 512)

            // Set background color 
            img.colorAllocate(128, 255, 125);
            
            bus.copyResized(img, 100, 600,0,0, 100, 100, 512, 512)

            // Set text color 
            var txtColor = img.colorAllocate(255, 0, 255);
            
            // Set full path to font file 
            var fontPath = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
            
            // Render string in image 
            img.stringFT(txtColor, fontPath, 24, 0, 10, 60, text);
            
            // Write image buffer to disk 
            img.savePng(`generated-images/${journey.id}-output.png`, 1, function(err) {
                if(err) {
                    throw err;
                }
            });
            
            // Destroy image to clean memory 
            img.destroy();
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
}

module.exports = ImageGenerator