const tripService = require('../services/trip-service')
const BASE_PATH = '/api/trip'
const axios = require('axios')

module.exports = addTripRoutes;

function addTripRoutes(app) {
    app.get(`${BASE_PATH}/placeinfo/:googleParams`, async(req, res) => {
        var strParams = '?'
        for (var key in req.query) {
            strParams += `${key}=${req.query[key]}&`
        }
        try {
            const googleRes = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json${strParams}`)
            const placeDetails = googleRes.data
            return res.json(placeDetails)
        }
        catch(err) {
            res.end('Could not fetch place info')
            throw(err)
        }
    })
    //get all
    app.get(`${BASE_PATH}`, async(req, res) => {
        try {
            const trips = await tripService.query(req.query)
            return res.json(trips)
        }
        catch(err) {
            res.end('Could not fetch trips')
            throw(err)
        }
    })
    //get one
    app.get(`${BASE_PATH}/:tripId`, async(req, res) => {
        const id = req.params.tripId
        try {
            const trip = await tripService.getById(id)
            return res.json(trip)
        }
        catch(err) {
            res.end('Could not fetch trip')
            throw(err)
        }
    })
    //delete
    app.delete(`${BASE_PATH}/:tripId`, _authenticateOrganizer, async(req, res) => {
        const id = req.params.tripId
        try {
            await tripService.remove(id)
            res.end(`Trip ${id} Deleted `)
        }
        catch(err) {
            res.end('Could not delete trip')
            throw(err)
        }
    })
    //create
    app.post(`${BASE_PATH}`, async(req, res) => {
        let trip = req.body
        if (!req.session.user) {
            res.end('Must be logged in to create trip')
            throw ('Must be logged in')
        }
        else {
            trip.organizer = req.session.user
            try {
                const newTrip = await tripService.create(trip)
                return res.json(newTrip)
            }
            catch(err) {
                res.end('Could not save trip')
                throw(err)
            }
        }
    })
    //update
    app.put(`${BASE_PATH}/:tripId`, _authenticateOrganizer, async(req, res) => {
        const trip = req.body
        try {
            const updatedTrip = await tripService.update(trip)
            return res.json(updatedTrip)
        }
        catch(err) {
            res.end('Could not update trip')
            throw(err)
        }
    }) //update trip likes
    app.put(`${BASE_PATH}/likes/:tripId`, async(req, res) => {
        const updatedLikes = req.body.likes
        var originalTrip = await tripService.getById(req.params.tripId)
        originalTrip.likes = updatedLikes
        try {
            const updatedTrip = await tripService.update(originalTrip)
            return res.json(updatedTrip)
        }
        catch(err) {
            res.end('Could not update likes')
            throw(err)
        }
    })

}
//TODO: TRY USING PASSPORT for authntication.
async function _authenticateOrganizer(req, res, next) {
    if (!_isUserMatch(req)) {
            res.status(401).end('Unauthorized');
            return;
        }
    next()
}

async function _isUserMatch(req) {
    const trip = await tripService.getById(req.params.tripId)  
    return (!req.session.user 
        || req.session.user._id !== trip.organizer._id)
}


 




    






 