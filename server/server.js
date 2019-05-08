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
    console.log(`global broadcast hit`)
    socket.broadcast.emit('global response',data)
  })

  socket.on('emit to global socket', data => {
    console.log('global emit hit')
    socket.emit('global response', data)
  })

  socket.on('blast to global socket', data => {
    console.log('global blast hit')
    io.sockets.emit('global response', data)
  })

  socket.on('typing', data => {
    socket.broadcast.emit('typing')
  })

  socket.on('stopped typing', data => {
    socket.broadcast.emit('stopped typing')
  })

  // ROOM SOCKETS
  socket.on('join room', data => {
    socket.join(data.room)
  })

  socket.on('broadcast to room socket', data => {
    console.log(`broadcast to room ${data.room}`)
    socket.to(data.room).broadcast.emit('room response', data)
  })
  socket.on('emit to room socket', data => {
    console.log(`emit to room ${data.room}`)
    socket.emit('room response', data)
  })
  socket.on('blast to room socket', data => {
    console.log(`blast to room ${data.room}`)
    io.to(data.room).emit('room response', data)
  })
})

