import express from 'express';
import http from 'http';
import createGame from './public/game.js';
import { Server } from 'socket.io';

const app = express()
const server = http.createServer(app);
const sockets = new Server(server)

app.use(express.static('public'))

const game = createGame()

game.subscribe((command) => {
  sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
  const playerId = socket.id
  console.log('New player connected:', playerId)

  game.addPlayer({playerId})

  socket.on('disconnect', () => {
    console.log('Player disconnected:', playerId)
    game.removePlayer({playerId})
  })

  socket.on('move-player', (command) => {
    command.playerId = playerId
    command.type = 'move-player'

    game.movePlayer(command)
  })

  socket.emit('setup', game.state)
})

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000')
})