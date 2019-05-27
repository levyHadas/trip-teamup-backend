const mongoService = require('./mongo-service')
const imgService = require('./img-service')
const ObjectId = require('mongodb').ObjectId;




module.exports = {
    query,
    create,
    getById,
    update,
    remove
}


async function query(query) {
    queryToMongo = {}
    if (query.name) queryToMongo.budget = {'$regex': query.name, '$options' : 'i'}
    if (query.type) queryToMongo.location = {'$regex': query.type, '$options' : 'i'}
    const db = await mongoService.connect()
    try {
        const res = await db.collection('trip').find(queryToMongo).toArray()
        return res
    }
    catch(err) {
        throw (err, 'Could not get trips.')
    }
}


async function _addImgs(trip) {
    var urls = []
    if (!trip.itinerary.length) {
        urls.push(await imgService.suggestImg(trip.country))
    }
    else {
        const itinerary = trip.itinerary.map(place => place.formatted_address)
        urls = await imgService.suggestImgs(itinerary)
    }
    trip.imgs = urls
}

async function create(trip) {
    await _addImgs(trip)
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
    await _addImgs(trip)
    console.log(trip)
    const strTripId = trip._id
    trip._id = new ObjectId(trip._id)
    const db = await mongoService.connect()
    await db.collection('trip').updateOne({_id:trip._id},{$set:trip})
    trip._id = strTripId
    return trip    
}






