const mongoService = require('./mongo-service')
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    getById,
    addUser,
    checkLogin,
    update,
    query
}


async function addUser(user) {
    const db = await mongoService.connect()
    try {
        var res = await db.collection('user').findOne({username:user.username })
    }
    catch {
        throw ('could not connect to database')
    }
    if (res) throw ('username taken')
    else {
        try {
            if (!user.img) user.img = `https://api.adorable.io/avatars/50/${user.username}`
            const res = await db.collection('user').insertOne(user)
            user._id = res.insertedId
            return user
        }
        catch {
            throw ('Could not add user. Unknown error')
        }
    }
}

async function checkLogin(user) {
    var queryToMongo = {$and:[{username:user.username }, {password:user.password }]}
    const db = await mongoService.connect()
    const res = await db.collection('user').findOne(queryToMongo)
    if (!res) throw ('wrong credentials')
    else return res
}


async function getById(id) {
    const _id = new ObjectId(id)
    const db = await mongoService.connect()
    const res = await db.collection('user').findOne({ _id })
    if (!res) throw ('User does not exist')
    return res
}

async function update(user) {
    const strUserId = user._id
    user._id = new ObjectId(user._id)
    const db = await mongoService.connect()
    await db.collection('user').updateOne({_id:user._id},{$set:user})
    user._id = strUserId
    return user    
}

async function query(query) {
    if (query && query.usersIds) {
        const usersIds = JSON.parse(query.usersIds)
        const objectIds = usersIds.map(id => new ObjectId(id))
        query = {"_id": {"$in":objectIds}}
    }
    const db = await mongoService.connect()
    const res = await db.collection('user').find(query).toArray()
    return res
}





