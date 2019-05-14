const userService = require('../services/user-service')


module.exports = addUserRoutes;

function addUserRoutes(app) {
    
    //create user
    app.post('/signup', (req, res) => {
        if (req.body.username && req.body.password) {
            const username = req.body.username
            const password = req.body.password
            userService.addUser({ username, password })
            .then(user => {
                userService.checkLogin({ username:user.username, password:user.password })
                .then((user) => {
                        delete user.password
                        req.session.user = user
                        return res.json(user)
                    })
                })
                .catch(err => {
                    res.status(400).end()
                    throw(err)
                })
            } 
        else res.status(401).end()
    })
             
    app.post('/login', (req, res) => {
        if (!req.body.username || !req.body.password) res.status(401).end()
        else { 
            const username = req.body.username
            const password = req.body.password
            userService.checkLogin({ username, password })
            .then(user => {
                delete user.password
                req.session.user = user       
                req.session.save()
                return res.json(user)
            })
                .catch(err => {
                    res.status(403).end()
                    throw(err)
                })
        }
    })

    app.get(`/loggedUser`, (req, res) => {
        const loggedUser = req.session.user
        return res.json(loggedUser)
    })
    
    app.get(`/logout`, (req, res) => {
        req.session.destroy()
        res.clearCookie('connect.sid')
        res.end()
    })

}


    

