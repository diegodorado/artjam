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

let talking = false
let talkingFrame = 0

function format (text, wrap, delimiters) {
	var lines = split(text, wrap);
	var maxLength = max(lines);

	var balloon;
	if (lines.length === 1) {
		balloon = [
			" " + top(maxLength), 
			delimiters.only[0] + " " + lines[0] + " " + delimiters.only[1],
			" " + bottom(maxLength)
		];
	} else {
		balloon = [" " + top(maxLength)];

		for (var i = 0, len = lines.length; i < len; i += 1) {
			var delimiter;

			if (i === 0) {
				delimiter = delimiters.first;
			} else if (i === len - 1) {
				delimiter = delimiters.last;
			} else {
				delimiter = delimiters.middle;
			}

			balloon.push(delimiter[0] + " " + pad(lines[i], maxLength) + " " + delimiter[1]);
		}

		balloon.push(" " + bottom(maxLength));
	}

	return balloon.join("\n"); //os.EOL
}

function split (text, wrap) {
	text = text.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '');

	var lines = [];
	if (!wrap) {
		lines = text.split("\n");
	} else {
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
	}

	return lines;
}

function max (lines) {
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

function top (length) {
	return new Array(length + 3).join("_");
}

function bottom (length) {
	return new Array(length + 3).join("-");
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

const text =  `
    ¿Qué te calienta?                   
    ¿Qué te da placer?                
    ¿Por qué te gusta lo que te gusta?      
    Con respeto y con amor.             
    Sin tabúes y sin discriminación.        
    Afectos, amor y responsabilidad.          
    Disfrute, goce y deseos.                
    Un mundo paralelo en donde no nos juzguen
    por cómo vemos y percibimos,         
    donde estemos en igualdad de condiciones,              
    más allá de nuestra raza, género o edad...           
    más acá, más cerca de nuestros placeres.       
    Lancemos un grito orgásmico sin tapujos.      
`

const say = (text, wrap) => {
	delimiters = {
		first : ["/", "\\"],
		middle : ["|", "|"],
		last : ["\\", "/"],
		only : ["<", ">"]
	};

	return format(text, wrap, delimiters);
}

const think = (text, wrap) => {
	delimiters = {
		first : ["(", ")"],
		middle : ["(", ")"],
		last : ["(", ")"],
		only : ["(", ")"]
	};

	return format(text, wrap, delimiters);
}



const update = (delta) => {
}

const draw = () => {
  const index = frameIndex % intro.length
  const frame = intro[index]

  let s = ""

  if(talking) {

    s += title
    s += say(text.substr(0,talkingFrame+1), 40)
    s += `
         \\
          \\
    `
    s += tiger

    s += `/${'-'.repeat(80)}\\\n`
    s += `|${' '.repeat(80)}|\n`
    //s += cow.split("\n").map(l => `|    ${l}${' '.repeat(76-l.length)}|`).join("\n")
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
  talking = true
  talkingFrame = 0
}

document.addEventListener("DOMContentLoaded", () => {
  raf(mainLoop)
})

document.addEventListener('keydown', onKeydown)
