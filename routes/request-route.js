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
            var organizer = await userService.getById(organizerId) 
            var requestToUpdateIdx = organizer.incomingRequests.findIndex(request => {
                return request._id === updatedRequest._id})
            if (requestToUpdateIdx !== -1) {
                organizer.incomingRequests[requestToUpdateIdx] = updatedRequest
                const updatedOrganizer = await userService.update(organizer)
            //}
                return res.json(updatedOrganizer)
            }
            else throw('incoming request not found')
        }
        catch(err) {
            res.end('Could not update incoming request')
            throw (err)
        }
    })

    //update outgoing
    app.put(`${BASE_PATH}/outgoing/:memberId`, async(req, res) => {
        try {
            const { memberId } = req.params
            const updatedRequest = req.body
            var member = await userService.getById(memberId)
            var requestToUpdateIdx = member.outgoingRequests.findIndex(request => {
                return request._id === updatedRequest._id
            })
            if (requestToUpdateIdx !== -1) {
                member.outgoingRequests[requestToUpdateIdx] = updatedRequest //update status
                if ( updatedRequest.status === 'approved') { //if approved -
                    var joinedTrip = await tripService.getById(updatedRequest.tripId)
                    joinedTrip.members.push(updatedRequest.memberId) //add to trips's members
                    await tripService.update(joinedTrip) //save the trip
                    member.trips.push(updatedRequest.tripId)//add this to member's trip
                }
                const updatedMember = await userService.update(member) //save update in member
                return res.json(updatedMember)
            }
            else throw ('outgoing request not found')
        }
        catch(err) {
            res.end('Could not update outgoing request')
            throw (err)
        }

    })
 


}



 