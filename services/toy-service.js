const mongoService = require('./mongo-service')
const ImgService = require('./img-service')

const ObjectId = require('mongodb').ObjectId;


// function checkLogin({ nickname }) {
//     return mongoService.connect()
//         .then(db => db.collection('toy').findOne({ nickname }))
// }

module.exports = {
    query,
    getById,
    add,
    remove,
    update
}

async function query(query) {
    queryToMongo = {}
    if (query.name) queryToMongo.name = {'$regex': query.name, '$options' : 'i'}
    if (query.type) queryToMongo.type = {'$regex': query.type, '$options' : 'i'}
    if (query.inStock) { 
        if (query.inStock !== 'all') queryToMongo.inStock = JSON.parse(query.inStock)
    }
    return mongoService.connect()
        .then(db => db.collection('toy').find(queryToMongo).toArray())
}

function getById(id) {
    const _id = new ObjectId(id)
    return mongoService.connect()
        .then(db => db.collection('toy').findOne({_id}))
}

async function add(toy) {
    toy.imgUrl = await ImgService.suggestImgs(`toy ${toy.name}`)
    const db = await mongoService.connect()
    const res = await db.collection('toy').insertOne(toy)
    toy._id = res.insertedId
    return toy
}

async function update(toy) {
    if (!toy.imgUrl) toy.imgUrl = await ImgService.suggestImgs(`toy ${toy.name}`)
    const strToyId = toy._id
    toy._id = new ObjectId(toy._id)
    const db = await mongoService.connect()
    await db.collection('toy').updateOne({_id:toy._id},{$set:toy})
    toy._id = strToyId
    return toy    
}

function remove(id) {
    const _id = new ObjectId(id)
    return mongoService.connect()
        .then(db => db.collection('toy').deleteOne({_id}))
}


