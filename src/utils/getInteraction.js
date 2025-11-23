const getInteraction = e => {
  const isEnter = e.keyCode === 13
  const isSpace = e.keyCode === 32
  const isClick = e.type === 'click'

  return { isEnter, isClick, isSpace }
}

export default getInteraction
