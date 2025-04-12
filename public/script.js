import createKeyboardListener from './keyboardListener.js'
import createGame from './game.js';
import renderScreen from './renderScreen.js';

const canvas = document.getElementById('canvas');

const game = createGame()
const keyboardListener = createKeyboardListener()

const socket = io()

socket.on("connect", () => {
  const playerId = socket.id
  console.log("Connected to server with player ID: ", playerId)
})

socket.on("setup", (state) => {
  console.log("Bootstrapping game state: ", state)
  game.setState(state)

  
  const ctx = canvas.getContext('2d');
  renderScreen(ctx, game, requestAnimationFrame, socket.id)
  keyboardListener.setPlayerId(socket.id)
  keyboardListener.subscribe(game.movePlayer)
  keyboardListener.subscribe((command) => {
    socket.emit('move-player', command)
  })
})

socket.on("add-player", (command) => {
  console.log("Adding player: ", command)
  game.addPlayer(command)
})

socket.on("remove-player", (command) => {
  console.log("Removing player: ", command)
  game.removePlayer(command)
})

socket.on("move-player", (command) => {
  console.log("Moving player: ", command)
  if(command.playerId === socket.id) return
  game.movePlayer(command)
})