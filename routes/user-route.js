const userService = require('../services/user-service')
const BASE_PATH = 'api/user'

module.exports = addUserRoutes;


function addUserRoutes(app) {

    //create user
    

    app.post(`${BASE_PATH}/signup`, async(req, res) => {
        if (req.body.username && req.body.password) {
            const user = req.body
            try {
                const signedUIser = await userService.addUser(user)
                return res.json(signedUIser)
            }
            catch(err) {
                res.status(401).end('Could not sign up')
                throw (err)
            }
        }
        else res.status(401).end()
    })

    app.post(`${BASE_PATH}/login`, async(req, res) => {
        if (!req.body.username || !req.body.password) res.status(401).end()
        else {
            const user = req.body
            try {
                const loggedUser = await userService.checkLogin(user)
                delete loggedUser.password
                req.session.user = loggedUser
                return res.json(loggedUser)
            }
            catch(err){
                res.status(401).end('Could not login')
                throw (err)
            }
        }
    })
    
    app.get(`${BASE_PATH}/loggedUser`, (req, res) => {
        const loggedUser = req.session.user
        return res.json(loggedUser)
    })
    
    app.get(`${BASE_PATH}/logout`, (req, res) => {
        // console.log('req.session.user: ', req.session.user)
        req.session.destroy()
        res.clearCookie('connect.sid')
        res.end()
        return Promise.resolve()
    })
    
    app.put(`${BASE_PATH}/:userId`, async(req, res) => {
        const user = req.body
        try {
            const updatedUser = await userService.update(user)
            req.session.user = updatedUser
            return res.json(updatedUser)
        }
        catch(err) {
            res.end('Could not update user')
            throw(err)
        }
    })

    // app.get(`${BASE_PATH}/:userId`, (req, res) => {
    //     const {userId} = req.params
    //     userService.getById(userId)
    //         .then(user => res.json(user))
    // })


    



}



    //get users
    // app.get(BASE_PATH, (req, res) => {
    //     userService.query()
    //         .then(users => res.json(users))
    // })

 