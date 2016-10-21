import dom from './core'
import {
  LinkedList,
  assign,
  each,
  isFunc
} from 'ilos'

const root = document.documentElement

export default assign(dom, {
  hasListen(el, type, cb) {
    return hasListen(el, type, cb)
  },
  on(el, type, cb, once) {
    if (addListen(el, type, cb, once === true))
      canBubbleUp[type] ? delegateEvent(type, cb) : bandEvent(el, type, cb)
    return dom
  },
  once(el, type, cb) {
    return dom.on(el, type, cb, true)
  },
  off(el, type, cb) {
    if (removeListen(el, type, cb))
      canBubbleUp[type] ? undelegateEvent(type, cb) : unbandEvent(el, type, cb)
    return dom
  },
  dispatchEvent(el, type, opts) {
    let hackEvent
    if (document.createEvent) {
      hackEvent = document.createEvent('Events')
      hackEvent.initEvent(type, true, true, opts)
      assign(hackEvent, opts)
      el.dispatchEvent(hackEvent)
    } else if (dom.inDoc(el)) { //IE6-8触发事件必须保证在DOM树中,否则报'SCRIPT16389: 未指明的错误'
      hackEvent = document.createEventObject()
      assign(hackEvent, opts)
      el.fireEvent('on' + type, hackEvent)
    }
    return hackEvent
  }
})

const mouseEventReg = /^(?:mouse|contextmenu|drag)|click/,
  keyEventReg = /^key/,
  eventProps = ['altKey', 'bubbles', 'cancelable', 'ctrlKey', 'currentTarget', 'propertyName',
    'eventPhase', 'metaKey', 'relatedTarget', 'shiftKey', 'target', 'view', 'which'
  ],
  eventFixHooks = {},
  keyEventFixHook = {
    props: ['char', 'charCode', 'key', 'keyCode'],
    fix: function(event, original) {
      if (event.which == null)
        event.which = original.charCode != null ? original.charCode : original.keyCode
    }
  },
  mouseEventFixHook = {
    props: ['button', 'buttons', 'clientX', 'clientY', 'offsetX', 'offsetY', 'pageX', 'pageY', 'screenX', 'screenY', 'toElement'],
    fix: function(event, original) {
      var eventDoc, doc, body,
        button = original.button

      if (event.pageX == null && original.clientX != null) {
        eventDoc = event.target.ownerDocument || document
        doc = eventDoc.documentElement
        body = eventDoc.body
        event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0)
        event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0)
      }
      if (!event.which && button !== undefined)
        event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)))
    }
  }

class Event {
  constructor(event) {
    let type = event.type,
      fixHook = eventFixHooks[type],
      i, prop

    this.originalEvent = event
    this.type = event.type
    this.returnValue = !(event.defaultPrevented || event.returnValue === false || event.getPreventDefault && event.getPreventDefault())
    this.timeStamp = event && event.timeStamp || (new Date() + 0)

    i = eventProps.length
    while (i--) {
      prop = eventProps[i]
      this[prop] = event[prop]
    }

    if (!fixHook)
      eventFixHooks[type] = fixHook = mouseEventReg.test(type) ? mouseEventFixHook : keyEventReg.test(type) ? keyEventFixHook : {}

    if (fixHook.props) {
      let props = fixHook.props
      i = props.length
      while (i--) {
        prop = props[i]
        this[prop] = event[prop]
      }
    }

    if (!this.target)
      this.target = event.srcElement || document
    if (this.target.nodeType == 3)
      this.target = this.target.parentNode

    if (fixHook.fix)
      fixHook.fix(this, event)
  }

  preventDefault() {
    let e = this.originalEvent
    this.returnValue = false
    if (e) {
      e.returnValue = false
      if (e.preventDefault)
        e.preventDefault()
    }
  }

  stopPropagation() {
    let e = this.originalEvent
    this.cancelBubble = true
    if (e) {
      e.cancelBubble = true
      if (e.stopPropagation)
        e.stopPropagation()
    }
  }

  stopImmediatePropagation() {
    let e = this.originalEvent
    this.isImmediatePropagationStopped = true
    if (e.stopImmediatePropagation)
      e.stopImmediatePropagation()
    this.stopPropagation()
  }
}

const listenKey = '__LISTEN__'

function addListen(el, type, handler, once) {
  if (!isFunc(handler))
    throw TypeError('Invalid Event Handler')

  let listens = el[listenKey],
    handlers,
    ret = false

  if (!listens)
    el[listenKey] = listens = {}

  if (!(handlers = listens[type])) {
    listens[type] = handlers = new LinkedList()
    ret = true
  } else if (handlers.contains(handler)) {
    return false
  }
  handlers.push({
    handler: handler,
    once: once
  })
  return ret
}

function removeListen(el, type, handler) {
  let listens = el[listenKey],
    handlers = listens && listens[type]

  if (handlers && !handlers.empty()) {
    handlers.remove(handler)
    return handlers.empty()
  }
  return false
}

function getListens(el, type) {
  let listens = el[listenKey]

  return listens && listens[type]
}

function hasListen(el, type, handler) {
  let listens = el[listenKey],
    handlers = listens && listens[type]

  if (handlers)
    return handler ? handlers.contains(handler) : !handlers.empty()
  return false
}

const bind = dom.W3C ? function(el, type, fn, capture) {
    el.addEventListener(type, fn, capture)
  } : function(el, type, fn) {
    el.attachEvent('on' + type, fn)
  },
  unbind = dom.W3C ? function(el, type, fn) {
    el.removeEventListener(type, fn)
  } : function(el, type, fn) {
    el.detachEvent('on' + type, fn)
  },
  canBubbleUpArray = ['click', 'dblclick', 'keydown', 'keypress', 'keyup',
    'mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'wheel', 'mousewheel',
    'input', 'change', 'beforeinput', 'compositionstart', 'compositionupdate', 'compositionend',
    'select', 'cut', 'copy', 'paste', 'beforecut', 'beforecopy', 'beforepaste', 'focusin',
    'focusout', 'DOMFocusIn', 'DOMFocusOut', 'DOMActivate', 'dragend', 'datasetchanged'
  ],
  canBubbleUp = {},
  focusBlur = {
    focus: true,
    blur: true
  },
  eventHooks = {},
  eventHookTypes = {},
  delegateEvents = {}

each(canBubbleUpArray, (name) => {
  canBubbleUp[name] = true
})
if (!dom.W3C) {
  delete canBubbleUp.change
  delete canBubbleUp.select
}

function bandEvent(el, type, cb) {
  let hook = eventHooks[type]
  if (!hook || !hook.bind || hook.bind(el, type, cb) !== false)
    bind(el, hook ? hook.type || type : type, dispatch, !!focusBlur[type])
}

function unbandEvent(el, type, cb) {
  let hook = eventHooks[type]
  if (!hook || !hook.unbind || hook.unbind(el, type, cb) !== false)
    unbind(el, hook ? hook.type || type : type, dispatch)
}

function delegateEvent(type, cb) {
  if (!delegateEvents[type]) {
    bandEvent(root, type, cb)
    delegateEvents[type] = 1
  } else {
    delegateEvents[type]++;
  }
}

function undelegateEvent(type, cb) {
  if (delegateEvents[type]) {
    delegateEvents[type]--;
    if (!delegateEvents[type])
      unbandEvent(root, type, cb)
  }
}

let last = new Date()

function dispatchElement(el, event, isMove) {
  let handlers = getListens(el, event.type)

  if (handlers) {
    let handler, i, l

    event.currentTarget = el
    event.isImmediatePropagationStopped = false
    handlers.each((handler) => {
      if (isMove) {
        let now = new Date()
        if (now - last > 16) {
          handler.handler.call(el, event)
          last = now
        }
      } else {
        handler.handler.call(el, event)
      }

      if (handler.once)
        dom.off(el, event.type, handler.handler)
      return !event.isImmediatePropagationStopped
    })
  }
}

function dispatchEvent(el, type, event) {
  if (el.disabled !== true || type !== 'click') {
    let isMove = /move|scroll/.test(type)
    if (canBubbleUp[type]) {
      while (el && el.getAttribute && !event.cancelBubble) {
        dispatchElement(el, event, isMove)
        el = el.parentNode
      }
    } else
      dispatchElement(el, event, isMove)
  }
}

function dispatch(event) {
  event = new Event(event)
  let type = event.type,
    el = event.target
  if (eventHookTypes[type]) {
    type = eventHookTypes[type]
    let hook = eventHooks[type]
    if (hook && hook.fix && hook.fix(el, event) === false)
      return
    event.type = type
    dispatchEvent(el, type, event)
  } else {
    dispatchEvent(el, type, event)
  }
}

//针对firefox, chrome修正mouseenter, mouseleave
if (!('onmouseenter' in root)) {
  each({
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  }, function(origType, fixType) {
    eventHooks[origType] = {
      type: fixType,
      fix(elem, event, fn) {
        let t = event.relatedTarget
        return !t || (t !== elem && !(elem.compareDocumentPosition(t) & 16))
      }
    }
  })
}
//针对IE9+, w3c修正animationend
each({
  AnimationEvent: 'animationend',
  WebKitAnimationEvent: 'webkitAnimationEnd'
}, function(construct, fixType) {
  if (window[construct] && !eventHooks.animationend) {
    eventHooks.animationend = {
      type: fixType
    }
  }
})

//针对IE6-8修正input
if (!('oninput' in document.createElement('input'))) {
  delete canBubbleUp.input
  eventHooks.input = {
    type: 'propertychange',
    fix(elem, event) {
      return event.propertyName == 'value'
    }
  }
  eventHooks.change = {
    bind(elem) {
      if (elem.type == 'checkbox' || elem.type == 'radio') {
        if (!elem.$onchange) {
          elem.$onchange = function(event) {
            event.type = 'change'
            dispatchEvent(elem, 'change', event)
          }
          dom.on(elem, 'click', elem.$onchange)
        }
        return false
      }
    },
    unbind(elem) {
      if (elem.type == 'checkbox' || elem.type == 'radio') {
        dom.off(elem, 'click', elem.$onchange)
        return false
      }
    }
  }
} else if (navigator.userAgent.indexOf('MSIE 9') !== -1) {
  eventHooks.input = {
      type: 'input',
      fix(elem) {
        elem.oldValue = elem.value
      }
    }
    // http://stackoverflow.com/questions/6382389/oninput-in-ie9-doesnt-fire-when-we-hit-backspace-del-do-cut
  document.addEventListener('selectionchange', function(event) {
    var actEl = document.activeElement
    if (actEl.tagName === 'TEXTAREA' || (actEl.tagName === 'INPUT' && actEl.type === 'text')) {
      if (actEl.value == actEl.oldValue)
        return
      actEl.oldValue = actEl.value
      if (hasListen(actEl, 'input')) {
        event = new Event(event)
        event.type = 'input'
        dispatchEvent(actEl, 'input', event)
      }
    }
  })
}


if (document.onmousewheel === void 0) {
  /* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
   firefox DOMMouseScroll detail 下3 上-3
   firefox wheel detlaY 下3 上-3
   IE9-11 wheel deltaY 下40 上-40
   chrome wheel deltaY 下100 上-100 */
  let fixWheelType = document.onwheel ? 'wheel' : 'DOMMouseScroll',
    fixWheelDelta = fixWheelType === 'wheel' ? 'deltaY' : 'detail'
  eventHooks.mousewheel = {
    type: fixWheelType,
    fix(elem, event) {
      event.wheelDeltaY = event.wheelDelta = event[fixWheelDelta] > 0 ? -120 : 120
      event.wheelDeltaX = 0
      return true
    }
  }
}
each(eventHooks, function(hook, type) {
  eventHookTypes[hook.type || type] = type
})
