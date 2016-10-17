export const nextTick = (function() {
  const callbacks = []
  var pending = false
  var timerFunc

  function nextTickHandler() {
    pending = false
    var copies = callbacks.slice(0)
    callbacks.length = 0
    for (var i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }
  if (typeof MutationObserver !== 'undefined') {
    var counter = 1
    var observer = new MutationObserver(nextTickHandler)
    var textNode = document.createTextNode(counter)
    observer.observe(textNode, {
      characterData: true
    })
    timerFunc = function() {
      counter = (counter + 1) % 2
      textNode.data = counter
    }
  } else {
    timerFunc = window.setImmediate || setTimeout
  }
  return function(cb, ctx) {
    var func = ctx ? function() {
      cb.call(ctx)
    } : cb
    callbacks.push(func)
    if (pending) return
    pending = true
    timerFunc(nextTickHandler, 0)
  }
})()
