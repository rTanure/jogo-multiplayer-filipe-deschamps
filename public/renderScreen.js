export default function renderScreen(ctx, game, requestAnimationFrame, currentPlayerId) {

  ctx.fillStyle = "white"
  ctx.clearRect(0, 0, 10, 10)

  for(const playerId in game.state.players) {
    const player = game.state.players[playerId]
    ctx.fillStyle = 'black'
    ctx.fillRect(player.x, player.y, 1, 1)
  }

  for(const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId]
    ctx.fillStyle = 'green'
    ctx.fillRect(fruit.x, fruit.y, 1, 1)
  }

  const currentPlayer = game.state.players[currentPlayerId]

  if(currentPlayer) {
    ctx.fillStyle = '#cccc00'
    ctx.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
  }

  requestAnimationFrame(() => {
    renderScreen(ctx, game, requestAnimationFrame, currentPlayerId)
  })
}