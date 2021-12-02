import intro from "./intro.json"
const introFrames = intro.map( rows => rows.join("\n"))

const requestAnimationFrame =  window.requestAnimationFrame

const FPS = 10
const BOARD_HEIGHT = intro[0].length
const BOARD_WIDTH = intro[0][0].length

const term = document.getElementById("term")

let posX = 0
let posY = 0

let lastFrameTimeMs = 0
let frameIndex = 0
const maxFPS = 10

const update = (delta) => {
}

const draw = () => {
  let index = frameIndex % introFrames.length
  let frameData = introFrames[index]
  term.innerText = frameData
}

const mainLoop = (timestamp) => {

    // Throttle the frame rate.
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        requestAnimationFrame(mainLoop);
        return;
    }

    let delta = timestamp - lastFrameTimeMs
    lastFrameTimeMs = timestamp

    update(delta)
    draw()
    requestAnimationFrame(mainLoop)
    frameIndex++
}



const keypressHandler = (instance, keyName) => {
  switch (keyName) {
    case Key.ArrowDown:
    case 's':
      posY = (posY + 1) % BOARD_HEIGHT;
      break;
    case Key.ArrowUp:
    case 'w':
      posY = posY === 0 ? BOARD_HEIGHT - 1 : posY - 1;
      break;
    case Key.ArrowLeft:
    case 'a':
      posX = posX === 0 ? BOARD_WIDTH - 1 : posX - 1;
      break;
    case Key.ArrowRight:
    case 'd':
      posX = (posX + 1) % BOARD_WIDTH;
      break;
    case Key.Escape:
      instance.exit();
      break;
  }

  frameHandler(instance);
}

const start = () => {
  requestAnimationFrame(mainLoop)
}

document.addEventListener("DOMContentLoaded", (event) => {
  start()
})
