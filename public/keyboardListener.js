export default function createKeyboardListener() {
  const state = {
    observers: [],
    playerId: null,
  }

  function setPlayerId(playerId) {
    state.playerId = playerId
  }

  function subscribe(observeFunction) {
    state.observers.push(observeFunction)
  }

  function notifyAll(command) {
    for(const observerFunction of state.observers) {
      observerFunction(command)
    }
  }

  document.addEventListener("keydown", handleKeyDown)
  function handleKeyDown(event) {
    const command = {
      playerId: state.playerId, 
      keyPressed: event.key
    }

    notifyAll(command)
  }

  return {
    subscribe,
    setPlayerId
  }

}