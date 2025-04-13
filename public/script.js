import createKeyboardListener from './keyboardListener.js'
import createGame from './game.js';
import renderScreen from './renderScreen.js';

const canvas = document.getElementById('canvas');
const btn_up = document.getElementById('btn_up');
const btn_down = document.getElementById('btn_down');
const btn_left = document.getElementById('btn_left');
const btn_right = document.getElementById('btn_right');

function simulateKey(key) {
  const event = new KeyboardEvent('keydown', {
    key: key,
    code: key,
    keyCode: key.startsWith('Arrow') ? 37 + ['Left', 'Up', 'Right', 'Down'].indexOf(key.replace('Arrow', '')) : 0,
    which: key.startsWith('Arrow') ? 37 + ['Left', 'Up', 'Right', 'Down'].indexOf(key.replace('Arrow', '')) : 0,
    bubbles: true
  });
  document.dispatchEvent(event);
}

// btn_up.addEventListener('touchstart', () => simulateKey('ArrowUp'));
// btn_down.addEventListener('touchstart', () => simulateKey('ArrowDown'));
// btn_left.addEventListener('touchstart', () => simulateKey('ArrowLeft'));
// btn_right.addEventListener('touchstart', () => simulateKey('ArrowRight'));
btn_up.addEventListener('click', () => simulateKey('ArrowUp'));
btn_down.addEventListener('click', () => simulateKey('ArrowDown'));
btn_left.addEventListener('click', () => simulateKey('ArrowLeft'));
btn_right.addEventListener('click', () => simulateKey('ArrowRight'));

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

socket.on("add-fruit", (command) => {
  console.log("Adding fruit: ", command)
  game.addFruit(command)
})

socket.on("remove-fruit", (command) => {
  console.log("Removing fruit: ", command)
  game.removeFruit(command)
})