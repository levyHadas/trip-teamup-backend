

module.exports = SocketService;

function SocketService(io) {

    io.on('connection', socket => {
    
        socket.emit('connectionTest', 'Hi from server')
        socket.on('connectionTest', msgFromFront => {
          console.log(msgFromFront)
        })
      
        socket.on('disconnect', () => {
          console.log('disconnected')
        })
      })

      
      // function _leavePartyRoom(socket) {
      //   socket.emit('setInPartyState', false)
      //   var roomToLeave = socket.room
      //   if (!roomToLeave) return
      //   socket.room = null
      //   socket.leave(roomToLeave._id)
      //   RoomService.leaveRoom(roomToLeave, socket.user)
      //   io.to(roomToLeave._id).emit('ShowUpdatedScores', roomToLeave.members) 
      // }
      


      



}
