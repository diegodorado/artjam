import intro from "./intro.json"
import {
  doge,
  tiger,
} from './avatars'

const raf = window.requestAnimationFrame

const height = intro[0].length
const width = intro[0][0].length

const term = document.getElementById('term')
const introMessage = "    Acaricia una tecla    "

const maxFPS = 10

// STATE
let lastFrameTimeMs = 0
let frameIndex = 0

let step = 0
let stepFrameAt = 0

const split = (text, wrap) => {
	//text = text.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '');

	var lines = [];
  var start = 0;
  while (start < text.length) {
    var nextNewLine = text.indexOf("\n", start);

    var wrapAt = Math.min(start + wrap, nextNewLine === -1 ? text.length : nextNewLine);

    lines.push(text.substring(start, wrapAt));
    start = wrapAt;

    // Ignore next new line
    if (text.charAt(start) === "\n") {
      start += 1;
    }
  }

	return lines;
}

const maxLine =  (lines) => {
	var max = 0;
	for (var i = 0, len = lines.length; i < len; i += 1) {
		if (lines[i].length > max) {
			max = lines[i].length;
		}
	}

	return max;
}

function pad (text, length) {
	return text + (new Array(length - text.length + 1)).join(" ");
}

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

const manifest = [
`
¿Qué te calienta?                   
¿Qué te da placer?                
¿Por qué te gusta lo que te gusta?      
`,
`
Con respeto y con amor.             
Sin tabúes y sin discriminación.        
`,
`
Afectos, amor y responsabilidad.          
Disfrute, goce y deseos.                
`,
`
Un mundo paralelo en donde no nos juzguen
por cómo vemos y percibimos,         
donde estemos en igualdad de condiciones,              
`,
`
más allá de nuestra raza, género o edad...           
más acá, más cerca de nuestros placeres.       
`,
`
Lancemos un grito orgásmico liberador.      
`
]

const delimiters = {
  first : ["/", "\\"],
  middle : ["|", "|"],
  last : ["\\", "/"],
}

const say = (text, wrap, maxchars) => {

	const lines = split(text, wrap);
	const maxLength = maxLine(lines);

	const top  = new Array(maxLength + 3).join("_")
	const balloon = [top];

  let charsLeft = maxchars
  for (var i = 0, len = lines.length; i < len; i += 1) {
    var delimiter;

    if (i === 0) {
      delimiter = delimiters.first
    } else if (i === len - 1) {
      delimiter = delimiters.last
    } else {
      delimiter = delimiters.middle
    }

    balloon.push(delimiter[0] + " " + pad(lines[i].substr(0,charsLeft), maxLength) + " " + delimiter[1])
    charsLeft -= lines[i].length
  }

	const bottom = new Array(maxLength + 3).join("-")
  balloon.push(bottom)

	return balloon.join("\n")
}

const update = (delta) => {
}

const moveRight = (text, count)  => {
	const margin  = new Array(count).join(" ")
  return text.split("\n").map(l => margin + l).join("\n")
}

const sayManifest = (index, animated) => {
  let s = ""
  s += title
  let l = manifest[index].length
  const stepFrame = frameIndex-stepFrameAt
  if(animated){
    // autoadvance step if reached the animation end
    if ( stepFrame > l){
      console.log("advance")
      step++
      stepFrameAt = frameIndex
    }

    l = Math.min(l,stepFrame)
  }
  s += say(manifest[index], 50, l+1)
  s += `
   \\
    \\
     \\
  `
  s += tiger
  s += `\n\n\n    ${(step%2 === 0) ? '( tocame una tecla continuar )' : ''}    \n`
  return s
}

const draw = () => {

  let s = ""

  switch(step){

    // intro
    case 0:

      const index = frameIndex % intro.length
      const frame = intro[index]

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
      break

    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
      s += sayManifest(Math.round(step/2)-1, step%2)
      break
    default:
      s += "... fin de la maqueta  =( ..."
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
  step++
  stepFrameAt = frameIndex
}

document.addEventListener("DOMContentLoaded", () => {
  raf(mainLoop)
})

document.addEventListener('keydown', onKeydown)
