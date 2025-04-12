// import { randomUUID } from "crypto"

export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  }

  const observers = []

  function start() {
    const frequency = 2500
    setInterval(addFruit, frequency)
  }

  function subscribe(observeFunction) {
    observers.push(observeFunction)
  }

  function notifyAll(command) {
    for(const observerFunction of observers) {
      observerFunction(command)
    }
  }

  function addPlayer(command) {
    const playerId = command.playerId
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

    state.players[playerId] = {
      x: playerX,
      y: playerY
    }

    notifyAll({
      type: 'add-player',
      playerId: playerId,
      playerX: playerX,
      playerY: playerY
    })
  }

  function removePlayer(command) {
    const playerId = command.playerId
    delete state.players[playerId]

    notifyAll({
      type: 'remove-player',
      playerId: playerId
    })
  }

  function addFruit(command) {
    const fruitId = command ? command.fruitId : Math.random().toString(36).substring(2, 15)
    const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
    const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    }

    notifyAll({
      type: 'add-fruit',
      fruitId: fruitId,
      fruitX: fruitX,
      fruitY: fruitY
    })
  }

  function removeFruit(command) {
    const fruitId = command.fruitId
    delete state.fruits[fruitId]

    notifyAll({
      type: 'remove-fruit',
      fruitId: fruitId
    })
  }

  function setState(newState) {
    Object.assign(state, newState)
  }

  function movePlayer(command) {
    notifyAll(command)
    const player = state.players[command.playerId]

    const acceptedMoves = {
      ArrowUp(player) {
        player.y = Math.max(player.y - 1, 0)
      },
      ArrowDown(player) {
        player.y = Math.min(player.y + 1, state.screen.height - 1)
      },
      ArrowLeft(player) {
        player.x = Math.max(player.x - 1, 0)
      },
      ArrowRight(player) {
        player.x = Math.min(player.x + 1, state.screen.width - 1)
      }
    }

    const moveFunction = acceptedMoves[command.keyPressed]
    if(moveFunction && player) {
      moveFunction(player)
      checkFruitCollision(command.playerId)
    }
  }

  function checkFruitCollision(playerId) {
    const player = state.players[playerId]

    for(const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId]

      if(player.x === fruit.x && player.y === fruit.y) {
        removeFruit({ fruitId })
      }
    }
  }

  return {
    movePlayer,
    addPlayer,
    addFruit,
    removeFruit,
    removePlayer,
    state,
    subscribe,
    setState,
    start
  }
}