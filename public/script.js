import createKeyboardListener from './keyboardListener.js'
import createGame from './game.js';
import renderScreen from './renderScreen.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const game = createGame()
const keyboardListener = createKeyboardListener()
keyboardListener.subscribe(game.movePlayer)
renderScreen(ctx, game, requestAnimationFrame)

const socket = io()

socket.on("connect", () => {
  const playerId = socket.id
  console.log("Connected to server with player ID: ", playerId)
})

socket.on("setup", (state) => {
  console.log("Bootstrapping game state: ", state)
  game.setState(state)
})

socket.on("add-player", (command) => {
  console.log("Adding player: ", command)
  game.addPlayer(command)
})