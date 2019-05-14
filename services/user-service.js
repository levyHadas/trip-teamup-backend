const mongoService = require('./mongo-service')

const ObjectId = require('mongodb').ObjectId;

function checkLogin(user) {
    var queryToMongo = {$and:[{username:user.username }, {password:user.password }]}
    return mongoService.connect()
        .then(db => db.collection('user').findOne(queryToMongo))
        .then(res => {
            if (!res) throw ('wrong credentials')
            else return res
        })

}


function addUser(user) {
    return mongoService.connect()
        .then(db => db.collection('user').findOne({username:user.username }))
        .then(res => {
            if (res) throw ('username taken')
            else {
                return mongoService.connect()
                    .then(db => db.collection('user').insertOne(user))
                    .then(res => {
                        console.log('here', res)
                        user._id = res.insertedId
                        return user
                    })
            }
       
        })
}







module.exports = {
    // query,
    // getById,
    addUser,
    checkLogin
    // checkLogin
}