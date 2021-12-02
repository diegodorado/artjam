import intro from "./intro.json"

const raf = window.requestAnimationFrame

const height = intro[0].length
const width = intro[0][0].length
const board = new Array(height*width)

const term = document.getElementById('term')
const log = document.getElementById('log')
const introMessage = "    Pulsa una tecla    "

const maxFPS = 10

// STATE
let lastFrameTimeMs = 0
let frameIndex = 0

const update = (delta) => {
}

const draw = () => {
  const index = frameIndex % intro.length
  const frame = intro[index]

  let s = ""

  for(let y = 0; y<height; y++){

    let row = frame[y]

    // add message if intro was played once
    if(frameIndex > intro.length && Math.abs(Math.floor(height/2)-y) <= 2){
      row = ""
      let i = 0
      for(let x = 0; x< width; x++){
        if(Math.floor(frameIndex/16) % 2 && Math.abs(Math.floor(width/2)-x) <= introMessage.length/2){
          if(Math.floor(height/2) === y){
            row += introMessage[i++]
          }
          else{
            row += " "
          }
        }
        else{
          row += frame[y][x]
        }
      }
    }

    s += row
    s += "\n"

  }

  term.textContent = s

}

const mainLoop = (timestamp) => {

    // Throttle the frame rate.
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        raf(mainLoop);
        return;
    }

    let delta = timestamp - lastFrameTimeMs
    lastFrameTimeMs = timestamp

    update(delta)
    draw()
    frameIndex++
    raf(mainLoop)
}

const onKeydown = (ev) => {
  log.textContent = `Pulsaste "${ev.key}" y nada...\nEn fin, es sólo una maqueta`
  console.log(ev);
}

document.addEventListener("DOMContentLoaded", () => {
  raf(mainLoop)
})

document.addEventListener('keydown', onKeydown)
