const DEFAULT_GAP = 10000
const PRECISION = 8
const MIN_THRESHOLD = 1

export default function getNewPosition(prevPos = 0, nextPos = 0) {
  let pos

  // moving to the top of the list
  if (prevPos === null && nextPos !== null) {
    // if there's enough space on the top substract the gap
    if (nextPos > DEFAULT_GAP) { pos = nextPos - DEFAULT_GAP } 

    // if the space is small but > 1, bisect
    else if (nextPos > MIN_THRESHOLD) { pos = nextPos / 2 }

    // if we are close to 0 substract a fixed value
    else { pos = nextPos - 0.1 }
  }

  // moving to the bottom of the list
  else if (nextPos === null && prevPos !== null) {
    pos = prevPos + DEFAULT_GAP
  }

  // moving between two items
  else if (prevPos !== null && nextPos !== null) {
    pos = (prevPos + nextPos) / 2
  }

  // list is empty or first item
  else {
    pos = DEFAULT_GAP
  }

  return Number(pos.toFixed(PRECISION))
}
