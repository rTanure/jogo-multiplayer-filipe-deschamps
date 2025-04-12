export default function createKeyboardListener() {
  const state = {
    observers: []
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
      playerId: 'player1', 
      keyPressed: event.key
    }

    notifyAll(command)
  }

  return {
    subscribe,
  }

}