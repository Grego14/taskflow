const DEFAULT_GAP = 10000
const PRECISION = 4

export default function getNewPosition(prevPos = 0, nextPos = 0) {
  let pos

  // moving to the top of the list
  if (prevPos === null && nextPos !== null) {
    // if the first element's position is too low, we bisect the distance to 0 
    // instead of subtracting to avoid entering negative values
    pos = nextPos > DEFAULT_GAP ? nextPos - DEFAULT_GAP : nextPos / 2
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
