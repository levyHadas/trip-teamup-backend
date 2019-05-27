'use strict';

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()
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

app.use(express.static('public'));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(session({
  secret: 'puki muki',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false}
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

AddUserRoutes(app)
AddTripRoutes(app)

// SocketService(io)











const PORT = process.env.PORT || 3003
server.listen(PORT, () => console.log(`Trip-teamup app is listening on port ${PORT}`))


