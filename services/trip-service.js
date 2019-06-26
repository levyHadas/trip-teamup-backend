const mongoService = require('./mongo-service')
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    create,
    getById,
    update,
    remove
}


async function query(query = {}) {
    var queryToMongo = {}
    if (query.tripsIds) {
        const tripsIds = JSON.parse(query.tripsIds)
        const objectIds = tripsIds.map(id => new ObjectId(id))
        queryToMongo = {"_id": {"$in":objectIds}}
    } else {
        if (query.country) queryToMongo.country = {'$regex': query.country, '$options' : 'i'}
        if (query.type) queryToMongo.type = {'$regex': query.type, '$options' : 'i'}
        if (query.status) queryToMongo.status = {'$regex': query.status, '$options' : 'i'}
        if (query.budget) {
            const budget = JSON.parse(query.budget)
            queryToMongo['budget.min'] = {'$gte' :budget.min}
            queryToMongo['budget.max'] = {'$lte' :budget.max}
        }
        if (query.startDate || query.endDate) {
            var startDate = (query.startDate) ? new Date(query.startDate).getTime() : 0
            var endDate = (query.endDate) ? new Date(query.endDate).getTime() : Infinity
            queryToMongo.tripDate = {'$gte' :startDate, '$lte' :endDate}
        }
    }
    const db = await mongoService.connect()
    try {
        const res = await db.collection('trip').find(queryToMongo).toArray()
        return res
    }
    catch(err) {
        throw (err, 'Could not get trips.')
    }
}

async function create(trip) {
    const db = await mongoService.connect()
    try {
        const res = await db.collection('trip').insertOne(trip)
        trip._id = res.insertedId
        return trip
    }
    catch(err) {
        throw (err, 'Could not add trip.')
    }
}

async function getById(id) {
    const _id = new ObjectId(id)
    const db = await mongoService.connect()
    try {
        const res = await db.collection('trip').findOne({ _id })
        if (!res) throw ('could not find Trip')
        return res
    }
    catch(err) {
        throw (err)
    }
}
async function remove(id) {
    const _id = new ObjectId(id)
    const db = await mongoService.connect()
    try {
        const res = await db.collection('trip').deleteOne({_id})
        if (res.deletedCount) return res
        throw ('Could not delete')
    }
    catch(err) {
        throw (err)
    }
}

async function update(trip) {
    const strTripId = trip._id
    trip._id = new ObjectId(trip._id)
    const db = await mongoService.connect()
    await db.collection('trip').updateOne({_id:trip._id},{$set:trip})
    trip._id = strTripId
    return trip    
}






