const axios = require('axios')
const cheerio = require('cheerio')


module.exports = {
    suggestImg,
    suggestImgs
}

async function suggestImg(searchTerm) {
    const res = await axios.get(`http://www.istockphoto.com/il/photos/${searchTerm}`)
    const siteData = await cheerio.load(res.data)
    const imgURL = await siteData('img.srp-asset-image').attr('src')
    return imgURL
}

async function suggestImgs(terms) {
    var urls = await Promise.all(terms.map(async(place) => {
        return suggestImg(place)
    }))
    return urls
}