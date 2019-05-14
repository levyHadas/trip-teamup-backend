const toyService = require('../services/toy-service')
const BASE_PATH = '/toy'

// function checkAdmin(req, res, next) {
//     if (req.method.toLowerCase() === 'put' || req.method.toLowerCase() === 'delete') {
//         console.log('Unauthorized?', req.session)
//         if (!req.session.user || !req.session.user.isAdmin ) {
//             res.status(401).end('Unauthorized');
//             return;
//         }
//     }
//     next();
// }

function addToyRoutes(app) {
    // app.use(checkAdmin)    
    // Toys REST API:

    // LIST
    app.get(`${BASE_PATH}`, (req, res) => {
        const query = req.query
        toyService.query(query)
        .then(toys => res.json(toys))      
    })
    
    // SINGLE - GET Full details
    app.get(`${BASE_PATH}/:toyId`, (req, res) => {
        const {toyId} = req.params
        toyService.getById(toyId)
        .then(toy => res.json(toy))
    })
    
    // DELETE
    app.delete(`${BASE_PATH}/:toyId`, (req, res) => {
        const toyId = req.params.toyId;
        toyService.remove(toyId)
            .then(() => res.end(`Toy ${toyId} Deleted `))
    })

    // CREATE
    app.post(`${BASE_PATH}`, (req, res) => {
        const toy = req.body;
        toyService.add(toy)
            .then(toy => res.json(toy))
    })
    
    //EDIT
    app.put(`${BASE_PATH}/:toyId`, (req, res) => {
        const toy = req.body;
        toyService.update(toy)
            .then(toy => res.json(toy))
    })

}


module.exports = addToyRoutes;