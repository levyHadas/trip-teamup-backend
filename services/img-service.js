const axios = require('axios')
const cheerio = require('cheerio')

module.exports = {
    // suggestImg,
    // suggestImgs,
    
}

// async function suggestImg(searchTerm) {
    // console.log('here', searchTerm)
    // const res = await axios.get(`http://www.istockphoto.com/il/photos/${searchTerm}`)
    // const siteData = await cheerio.load(res.data)
    // console.log('siteData', siteData)
    // if (!siteData) return promise.resolve('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnTCmJI6Fp3dIoVssgV3n3RnsrDGK_abQ96boBkcOM57-k4s9W')
    // const imgURL = await siteData('img.srp-asset-image').attr('src')
    // return imgURL
    // console.log(this.props.trip.itinerary[0].photos[0].photo_reference)
            //map imgs with photo_reference
            //https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=YOUR_API_KEY
// }

// async function suggestImgs(terms) {
//     try {
//         var urls = await Promise.all(terms.map(async(place) => {
//              return suggestImg(place)
//         }))
//         return urls
//     }
//     catch(err) {
//         console.log('here???')

//     }
// }

