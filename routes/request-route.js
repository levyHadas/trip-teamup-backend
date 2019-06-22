const userService = require('../services/user-service')
const tripService = require('../services/trip-service')
const BASE_PATH = '/api/request'

module.exports = addRequestRoutes;


function addRequestRoutes(app) {

    //add new incoming request
    app.post(`${BASE_PATH}/incoming/:organizerId`, async(req, res) => {
        try {
            const { organizerId } = req.params
            const newRequest = req.body
            var organizer = await userService.getById(organizerId)
            if (!organizer.incomingRequests) organizer.incomingRequests = [] //for users that wew created before adding these fields
            organizer.incomingRequests.push(newRequest)
            const updatedOrganizer = await userService.update(organizer)
            return res.json(updatedOrganizer)
        }
        catch(err) {
            res.end('Could not add incoming request')
            throw(err)
        }

    })
    //add new outgoing request
    app.post(`${BASE_PATH}/outgoing/:memberId`, async(req, res) => {
        try {
            const { memberId } = req.params
            const newRequest = req.body
            var member = await userService.getById(memberId)
            if (!member.outgoingRequests) member.outgoingRequests = [] //for users that wew created before adding these fields
            member.outgoingRequests.push(newRequest)
            const updatedMember = await userService.update(member)
            return res.json(updatedMember)
        }
        catch(err) {
            res.end('Could not add outgoing request')
            throw(err)
        }

    })

    //update incoming
    app.put(`${BASE_PATH}/incoming/:organizerId`, async(req, res) => {

        try {
            const { organizerId } = req.params
            const updatedRequest = req.body
            //{this needs to be a function for both: const updatedOrganizer = await request-service.updateRequest
            var organizer = await userService.getById(organizerId) 
            var requestToUpdateIdx = organizer.incomingRequests.findIndex( request => request.tripId === updatedRequest.tripId)
            if (requestToUpdateIdx !== -1) {
                organizer.incomingRequests[requestToUpdateIdx] = updatedRequest
                const updatedOrganizer = await userService.update(organizer)
            //}
                return res.json(updatedOrganizer)
            }
            else throw('request not found')
        }
        catch(err) {
            res.end('Could not update incoming request')
            throw(err)
        }

    })

    //update outgoing
    app.put(`${BASE_PATH}/outgoing/:memberId`, async(req, res) => {
        try {
            const { memberId } = req.params
            const updatedRequest = req.body
            var member = await userService.getById(memberId)
            var requestToUpdateIdx = member.outgoingRequests.findIndex( request => request.tripId === updatedRequest.tripId)
            if (requestToUpdateIdx !== -1) {
                member.outgoingRequests[requestToUpdateIdx] = updatedRequest
                if ( updatedRequest.status === 'approved') {
                    member.trips.push(updatedRequest.tripId)
                    var joinedTrip = tripService.getById(updatedRequest.tripId)
                    joinedTrip.members.push(updatedRequest.memberId)
                    await tripService.update(joinedTrip)
                }
                const updatedMember = await userService.update(member)
                return res.json(updatedMember)
            }
            throw('request not found')
        }
        catch(err) {
            res.end('Could not update outgoing request')
            throw(err)
        }

    })
 


}



 