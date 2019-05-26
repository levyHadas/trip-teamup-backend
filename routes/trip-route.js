const tripService = require('../services/trip-service')
const BASE_PATH = '/trip'

module.exports = addTripRoutes;
async function checkUserMatch(req, res, next) {
    console.log('INSIDE MIDDLEWARE: ', req.session.user);
    const trip = await tripService.getById(req.params.tripId)  
    if (!req.session.user 
        || req.session.user._id !== trip.organizer._id) {
            res.status(401).end('Unauthorized');
            return;
        }
    next()
}

function addTripRoutes(app) {

    
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
    app.delete(`${BASE_PATH}/:tripId`,checkUserMatch, async(req, res) => {
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
    app.put(`${BASE_PATH}/:tripId`,checkUserMatch, async(req, res) => {
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
    //update likes and members
    app.put(`${BASE_PATH}/memberslikes/:tripId`, async(req, res) => {
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
    })

}
 




    






 