
const tripService = require('./trip-service')
module.exports = socketService;

var loggedSockets = []

function socketService(io) {
    
  io.on('connection', socket => {
    socket.emit('connectionTest', 'Hi from server')
    socket.on('connectionTest', msgFromFront => {
      // console.log(msgFromFront)
    })
      
    socket.on('disconnect', () => {
      if (socket.user) {
        loggedSockets = 
          loggedSockets.filter(currSocket => socket.user._id !== currSocket.user._id)
      }
    })

    socket.on('user-logged-out', () => {
      if (socket.user) {
        loggedSockets = 
          loggedSockets.filter(currSocket => socket.user._id !== currSocket.user._id)
      }
    })

    socket.on('user-logged-in', (loggedUser) => {
      socket.user = loggedUser
      if ( !loggedSockets.some(socket => socket.user._id === loggedUser._id) ) {
        loggedSockets.push(socket)
        // console.log(loggedSockets.map(socket => socket.user._id))
      }
    })

    socket.on('new-incoming-request', async(request) => {
      const socketToRequest = loggedSockets.find(socket => socket.user._id === request.organizerId)
      if (socketToRequest) socketToRequest.emit('inform-new-incoming-request', request)
      //else - should go to inbox
    })

    socket.on('new-reply', async(request) => {
      const tripToReload = await tripService.getById(request.tripId)
      io.emit('reload-trip', tripToReload)
      const socketToReply = loggedSockets.find(socket => socket.user._id === request.memberId)
      if (socketToReply) socketToReply.emit('request-replied', request)
      //else - should go to inbox
    })
    
  })

}
