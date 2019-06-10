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
        
        const query = req.query
        try {
            const trips = await tripService.query(query)
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
    app.delete(`${BASE_PATH}/:tripId`,_checkDeleteAuth, async(req, res) => {
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
    app.put(`${BASE_PATH}/:tripId`,_checkUpdateAuth, async(req, res) => {
        const trip = req.body
        try {
            const updatedTrip = await tripService.update(trip)
            return res.json(updatedTrip)
        }
        catch(err) {
            res.end('Could not update trip')
            throw(err)
        }
    })

}

async function _checkDeleteAuth(req, res, next) {
    if (!_isUserMatch(req)) {
            res.status(401).end('Unauthorized');
            return;
        }
    next()
}
async function _checkUpdateAuth(req, res, next) {
    if (!_isUserMatch(req)) return _updateTripMembersAndLikes(req, res)
    else next()
}
async function _isUserMatch(req) {
    const trip = await tripService.getById(req.params.tripId)  
    return (!req.session.user 
        || req.session.user._id !== trip.organizer._id)
}

async function _updateTripMembersAndLikes(req, res) {
    var originalTrip = await tripService.getById(req.body._id)
    var originalTrip = originalTrip
    originalTrip.likes = req.body.likes
    originalTrip.members = [...req.body.members]
    try {
        const updatedTrip = await tripService.update(originalTrip)
        return res.json(updatedTrip)
    }
    catch(err) {
        res.end('Could not update trip')
        throw(err)
    }
}
 




    






 