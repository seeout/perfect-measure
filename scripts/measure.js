console.warn('Inited Measure.js ;)')

let $clicked, $hovered
let $hoveredCached

const overlays = {}
const lines = {}

const $hoverOverlay = createOverlay('hover')
const $compareOverlay = createOverlay('compare', {backgroundColor: '#8e44ad'})

document.addEventListener('click', initialClick)
document.addEventListener('mouseover', initialHover)

function initialClick (e) {
  e.preventDefault()

  if ($clicked) return

  $clicked = e.target
  $clickOverlay = createOverlay('click')
  changeOverlay($clickOverlay, getAbsoluteRect($clicked), {backgroundColor: 'transparent'})

  document.removeEventListener('mouseover', initialHover)
  document.addEventListener('mouseover', compareHover)
}

function initialHover (e) {
  changeOverlay($hoverOverlay, getAbsoluteRect(e.target))
}

function compareHover (e) {
  const hovering = getAbsoluteRect(e.target)
  const clicked = getAbsoluteRect($clicked) // todo: cache

  changeOverlay($hoverOverlay, hovering, {backgroundColor: 'transparent', borderColor: '#d35400'})

  if(hoveringInside(hovering, clicked)){

    // Top overlay
    createLine('compare_top', {
      top: clicked.top,
      height: hovering.top - clicked.top,
      width: 1,
      left: hovering.left + (hovering.width / 2)
    })

    // Right overlay
    createLine('compare_right', {
      top: hovering.top + (hovering.height / 2),
      height: 1,
      width: clicked.right - hovering.right,
      left: hovering.right
    })

    // Bottom overlay
    createLine('compare_bottom', {
      top: hovering.bottom,
      height: clicked.bottom - hovering.bottom,
      width: 1,
      left: hovering.left + (hovering.width / 2)
    })

    // Left overlay
    createLine('compare_left', {
      top: hovering.top + (hovering.height / 2),
      height: 1,
      width: hovering.left - clicked.left,
      left: clicked.left
    })

  }

  console.info('Clicked / Hovering (top)', clicked.top, '/', hovering.top, ' || (bottom)', clicked.bottom, '/', hovering.bottom)
}

// functions

function hoveringInside (hovering, clicked) {
  return (hovering.top > clicked.top && hovering.bottom < clicked.bottom)
}

// TODO: DRY with createOvelay, lot of same code
function createLine (name, style = {}) {
  if(lines[name]){
    $line = lines[name]
  }
  else {
    $line = document.createElement('div')
    document.body.appendChild($line)
    lines[name] = $line
  }

  Object.assign($line.style, {
    position: 'absolute',
    backgroundColor: '#3498db',
    pointerEvents: 'none',
    transition: 'all 0.1s ease-in-out'
  }, pixelizeStyle(style))

  return $line
}

function createOverlay (name, style) {
  if(overlays[name]){
    $overlay = overlays[name]
  }
  else {
    $overlay = document.createElement('div')
    document.body.appendChild($overlay)
    overlays[name] = $overlay
  }

  Object.assign($overlay.style, {
    position: 'absolute',
    backgroundColor: '#3498db',
    opacity: 0.4,
    boxSizing: 'border-box',
    pointerEvents: 'none',
    transition: 'all 0.1s ease-in-out'
  }, style)

  return $overlay
}

// should not exist, can be merged with create, probably
function changeOverlay (overlay, {width, height, top, left}, style = {}) {
  Object.assign(overlay.style, {
    width: pixelize(width),
    height: pixelize(height),
    top: pixelize(top),
    left: pixelize(left),
    border: '1px dashed #2980b9',
  }, style)
}

function pixelize (int) {
  return `${int}px`
}

const shouldBePixelized = ['width', 'height', 'top', 'right', 'bottom', 'left']
function pixelizeStyle (style) {
  let pixelized = {}
  for (var key in style) {
    if (style.hasOwnProperty(key)) {
      pixelized[key] = (shouldBePixelized.indexOf(key) !== -1) ? pixelize(style[key]) : style[key]
    }
  }
  return pixelized
}

function getAbsoluteRect (el) {
  const {top, left, right, bottom, width, height} = el.getBoundingClientRect()
  return {
    top: top + window.pageYOffset,
    left: left + window.pageXOffset,
    width,
    height,
    bottom,
    right
  }
}
