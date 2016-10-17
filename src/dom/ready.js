import dom from './event'

let readyList = [],
  isReady,
  root = document.documentElement

function fireReady(fn) {
  isReady = true
  while (fn = readyList.shift())
    fn()
}

if (document.readyState === 'complete') {
  setTimeout(fireReady)
} else if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', fireReady)
} else if (document.attachEvent) {
  document.attachEvent('onreadystatechange', function() {
    if (document.readyState === 'complete')
      fireReady()
  })
  if (root.doScroll && window.frameElement === null && window.external) {
    function doScrollCheck() {
      try {
        root.doScroll('left')
        fireReady()
      } catch (e) {
        setTimeout(doScrollCheck)
      }
    }
    doScrollCheck()
  }
}

dom.on(window, 'load', fireReady);

dom.ready = function(fn) {
  !isReady ? readyList.push(fn) : fn()
  return dom
}

export default dom
