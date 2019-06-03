'use strict';

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()
const favicon = require('express-favicon')
app.use(favicon('D:/Hadas/projects/trip-teamup/trip-teamup-backend' + '/build/favicon.ico'))
const path = require('path');
var server = require('http').Server(app)
// const io = require('socket.io')(server)

const AddUserRoutes = require('./routes/user-route')
const AddTripRoutes = require('./routes/trip-route')

// const SocketService = require ('./services/socket-service.js')


app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
  // enable set cookie
}));

app.use(express.static('D:/Hadas/projects/trip-teamup/trip-teamup-backend'));
app.use(express.static(path.join('D:/Hadas/projects/trip-teamup/trip-teamup-backend', 'build')));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(session({
  secret: 'puki muki',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false}
}))

app.get('/', (req, res) => {
  // res.send('Hello World!')
  res.sendFile('D:/Hadas/projects/trip-teamup/trip-teamup-backend/build/index.html');
})
// app.get('/*', function (req, res) {
//   res.sendFile('D:/Hadas/projects/trip-teamup/trip-teamup-backend/build/index.html');
// });

AddUserRoutes(app)
AddTripRoutes(app)

// SocketService(io)











const PORT = process.env.PORT || 3003
server.listen(PORT, () => console.log(`Trip-teamup app is listening on port ${PORT}`))


