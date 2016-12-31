import './watchers'
import {
  proxy
} from './proxy'
import {
  configuration,
  hasKey
} from './configuration'
import logger from './log'
import {
  Observi
} from './Observi'
import {
  parseExpr,
  isFunc,
  isArrayLike,
  isNil,
  hasOwnProp
} from 'ilos'

export * from './Watcher'
export {
  registerWatcher,
  initWatcher as init
}
from './watcherFactory'
export {
  proxy,
  configuration,
  logger
}

const hasOwn = Object.prototype.hasOwnProperty,
  PATH_JOIN = '.'
let bindObservi = '__observi__'
configuration.register('key.observi', bindObservi, 'init', (val) => (bindObservi = val))

function getOrCreateObservi(obj, expr) {
  let path = parseExpr(expr),
    observis,
    key
  if (!path.length)
    throw new Error('Invalid Observi Expression: ' + expr)
  obj = proxy.obj(obj)
  observis = hasOwn.call(obj, bindObservi) ? obj[bindObservi] : (obj[bindObservi] = {})
  key = path.join(PATH_JOIN)
  return observis[key] || (observis[key] = new Observi(obj, expr, path))
}

function getObservi(obj, expr) {
  let path = parseExpr(expr),
    observis
  if (!path.length)
    throw new Error('Invalid Observi Expression: ' + expr)
  observis = hasOwn.call(obj, bindObservi) ? obj[bindObservi] : undefined
  return observis && observis[path.join(PATH_JOIN)]
}

export function observe(obj, expr, cb) {
  if (!isFunc(cb))
    throw new Error('Invalid Observi Callback')
  let observi = getOrCreateObservi(proxy.obj(obj), expr)
  observi.on(cb)
  return observi.watcher.proxy
}

export function unobserve(obj, expr, cb) {
  if (!isFunc(cb))
    throw new Error('Invalid Observi Callback')
  let observi = getObservi(proxy.obj(obj), expr)
  if (observi) {
    observi.un(cb)
    return observi.watcher.proxy
  }
  return obj
}

export function isObserved(obj, expr, cb) {
  let observi = getObservi(proxy.obj(obj), expr)
  return observi && observi.isListened(cb)
}

export function createProxy(obj) {
  if (proxy.isEnable()) {
    var watcher = Observi.getOrCreateWatcher(obj)
    watcher.init()
    return watcher.proxy
  }
  return obj
}

export function eq(o1, o2) {
  return proxy.eq(o1, o2)
}

export function obj(o) {
  return proxy.obj(o)
}

export function $eachObj(obj, callback, scope, own) {
  let key,
    isOwn,
    i = 0

  scope = scope || obj
  for (key in obj) {
    if (!hasKey(key) && ((isOwn = hasOwnProp(obj, key)) || own === false)) {
      if (callback.call(scope, proxy(obj[key]), key, obj, isOwn) === false)
        return false
      i++
    }
  }
  return i
}

export function $eachArray(obj, callback, scope) {
  let i = 0,
    j = obj.length

  scope = scope || obj
  for (; i < j; i++) {
    if (callback.call(scope, proxy(obj[i]), i, obj, true) === false)
      return false
  }
  return i
}

export function $each(obj, callback, scope, own) {
  if (isArrayLike(obj)) {
    return $eachArray(obj, callback, scope)
  } else if (!isNil(obj)) {
    return $eachObj(obj, callback, scope, own)
  }
  return 0
}

export function $map(obj, callback, scope, own) {
  let isArray = isArrayLike(obj),
    ret = isArray ? [] : {},
    each = isArray ? $eachArray : $eachObj

  each(obj, function(val, key) {
    ret[key] = callback.apply(this, arguments)
  }, scope, own)
  return ret
}

export function $filter(obj, callback, scope, own) {
  let isArray = isArrayLike(obj),
    ret = isArray ? [] : {},
    each = isArray ? $eachArray : $eachObj

  each(obj, function(val, key) {
    if (callback.apply(this, arguments))
      isArray ? ret.push(val) : ret[key] = val
  })
  return ret
}

export function $aggregate(obj, callback, val, scope, own) {
  let ret = val

  $each(obj, function(val, key, obj, isOwn) {
    ret = callback.call(this, ret, val, key, obj, isOwn)
  }, scope, own)
  return ret
}

export function $convert(obj, keyGen, valGen, scope, own) {
  let o = {}

  $each(obj, function(val, key) {
    o[keyGen ? keyGen.apply(this, arguments) : key] = valGen ? valGen.apply(this, arguments) : val
  }, scope, own)
  return o
}

export function $reverseConvert(obj, valGen, scope, own) {
  let o = {}

  $each(obj, function(val, key) {
    o[val] = valGen ? valGen.apply(this, arguments) : key
  }, scope, own)
  return o
}


export function $keys(obj, filter, scope, own) {
  let keys = []

  $each(obj, function(val, key) {
    if (!filter || filter.apply(this, arguments))
      keys.push(key)
  }, scope, own)
  return keys
}

export function $values(obj, filter, scope, own) {
  let values = []

  $each(obj, function(val, key) {
    if (!filter || filter.apply(this, arguments))
      values.push(val)
  }, scope, own)
  return values
}

export function $assign(target) {
  let source,
    key,
    i = 1,
    l = arguments.length

  for (; i < l; i++) {
    source = arguments[i]
    for (key in source) {
      if (!hasKey(key) && hasOwnProp(source, key))
        target[key] = source[key]
    }
  }
  return target
}

export function $assignIf(target) {
  let source,
    key,
    i = 1,
    l = arguments.length

  for (; i < l; i++) {
    source = arguments[i]
    for (key in source) {
      if (!hasKey(key) && hasOwnProp(source, key) && !hasOwnProp(target, key))
        target[key] = source[key]
    }
  }
  return target
}
