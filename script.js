import createKeyboardListener from './keyboardListener.js'
import createGame from './game.js';
import renderScreen from './renderScreen.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const game = createGame()
const keyboardListener = createKeyboardListener()
keyboardListener.subscribe(game.movePlayer)

renderScreen(ctx, game, requestAnimationFrame)

game.addPlayer({
  playerId: 'player1',
  playerX: 0,
  playerY: 0
})
game.addFruit({
  fruitId: 'fruit1',
  fruitX: 2,
  fruitY: 2
})







