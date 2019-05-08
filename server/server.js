const express = require('express')
const socket = require('socket.io')
const PORT = 4000

const app = express()
app.use(express.json())

const server = app.listen(PORT, () => console.log(`listening on ${PORT}`))

const io = socket(server) //this is needed to enable web sockets to communicate over the server

// When a component has "io.connect", it connects to the socket on server and causes this block to run, listening for any socket messages
io.on('connection', socket => {
  console.log('socket connected')

  // GLOBAL SOCKETS
  socket.on('broadcast to global socket', data => {
    console.log(`broadcast hit`, data)
    socket.broadcast.emit('global response',data)
  })

  socket.on('emit to global socket', data => {
    console.log('emit hit', data)
    socket.emit('global response', data)
  })

  socket.on('blast to global socket', data => {
    console.log('blast hit', data)
    io.sockets.emit('global response', data)
  })
})

