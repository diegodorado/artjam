import intro from "./intro.json"
import cowsay from "cowsay-browser"


const raf = window.requestAnimationFrame

const height = intro[0].length
const width = intro[0][0].length
const board = new Array(height*width)

const term = document.getElementById('term')
const log = document.getElementById('log')
const introMessage = "    Acaricia una tecla    "

const maxFPS = 10

// STATE
let lastFrameTimeMs = 0
let frameIndex = 0

let talking = false
let talkingFrame = 0

const faces = ['bud-frogs', 'bunny', 'cheese', 'chick', 'cower', 'daemon', 'default', 'doge', 'dragon-and-cow', 'dragon', 'elephant-in-snake', 'elephant', 'eyes', 'flaming-sheep', 'kiss', 'kitty', 'koala', 'kosh', 'luke-koala', 'mech-and-cow', 'meow', 'moofasa', 'moose', 'ren', 'rooster', 'satanic', 'sheep', 'skeleton', 'small', 'squirrel', 'stegosaurus', 'stimpy', 'supermilker', 'turkey', 'turtle', 'tux', 'vader-koala', 'vader', 'www']
let face = faces[Math.floor(Math.random()*faces.length)]

// https://patorjk.com/software/taag/#p=display&f=AMC%203%20Liv1&t=Festival%20Placer
const title = `
             (                                (
             )# )          )             (    )# ) (
            (()/(  (    ( /((   )      ) )#  (()/( )#   )       (  (
             /(_))))#(  )#())# /((  ( /(((_)  /(_)|(_| /(  (   ))# )(
            (_))_/((_)#(_))((_|_))# )(_))_   (_))  _ )(_)) )# /((_|()#
            | |_(_))((_) |_ (_))((_|(_)_| |  | _ #| ((_)_ ((_|_))  ((_)
            | __/ -_|_-<  _|| # V // _* | |  |  _/| / _* / _|/ -_)| '_|
            |_| #___/__/#__||_|#_/ #__,_|_|  |_|  |_#__,_#__|#___||_|

`.replaceAll('#','\\').replaceAll('*','`')

const text =  `buenas, como estan?
...
algo así me imagino el espacio.
un anfitrión que converse
con el visitante
.
les gusta mas blanco o verde
el texto?
`


const update = (delta) => {
}

const draw = () => {
  const index = frameIndex % intro.length
  const frame = intro[index]

  let s = ""

  if(talking) {

    s += title

    const options = {
      text: text.substr(0,talkingFrame+1),
      f: face,
      //f: 'satanic', // Template for a cow, get inspiration from `./cows`
      d: true,
      //eyes: 'oo', // Select the appearance of the cow's eyes, equivalent to cowsay -e
      // One of 	"b", "d", "g", "p", "s", "t", "w", "y"
    }

    let cow = cowsay.say(options)
    s += `/${'-'.repeat(80)}\\\n`
    s += `|${' '.repeat(80)}|\n`
    s += cow.split("\n").map(l => `|    ${l}${' '.repeat(76-l.length)}|`).join("\n")
    s += `\n`
    s += `|${' '.repeat(80)}|\n`
    s += `\\${'-'.repeat(80)}/\n`
    term.textContent = s

    talkingFrame++
    talkingFrame %= text.length

    return

  }


  for(let y = 0; y<height; y++){

    let row = frame[y]

    // add message if intro was played once
    if(frameIndex > intro.length && Math.abs(Math.floor(height/2)-y) <= 2){
      row = ""
      let i = 0
      for(let x = 0; x< width; x++){
        if(Math.floor(frameIndex/16) % 2 && Math.abs(Math.floor(width/2)-x) <= introMessage.length/2){
          if(Math.floor(height/2) === y && i < introMessage.length){
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
  //log.textContent = `Pulsaste "${ev.key}" y nada...\nEn fin, es sólo una maqueta`
  face = faces[Math.floor(Math.random()*faces.length)]
  talking = true
  talkingFrame = 0
  console.log(face,ev)
}

document.addEventListener("DOMContentLoaded", () => {
  raf(mainLoop)
})

document.addEventListener('keydown', onKeydown)
