export {
  default as proxy
}
from './proxy'
export {
  default as Watcher
}
from './Watcher'
export {
  default as configuration
}
from './configuration'
export {
  registerWatcher,
  initWatcher as init
}
from './watcherFactory'
export {
  default as logger
}
from './log'
import proxy from './proxy'
import configuration from './configuration'
import Observi from './Observi'
import './watchers'
import {
  each,
  map,
  filter,
  aggregate,
  keys,
  values,
  parseExpr,
  isFunc,
} from 'ilos'

configuration.register('bindObservis', '__observi__', 'init')

const cfg = configuration.get(),
  hasOwn = Object.prototype.hasOwnProperty,
  PATH_JOIN = '###'

function hookArrayFunc(func, obj, callback, scope, own) {
  return func(obj, proxy.isEnable() ? callback && function(v, k, s, o) {
    return callback.call(this, proxy.proxy(v), k, s, o)
  } : callback, scope, own)
}

function getOrCreateObservi(obj, expr) {
  let bindObservis = cfg.bindObservis,
    path = parseExpr(expr),
    observis,
    key
  if (!path.length)
    throw new Error('Invalid Observi Expression: ' + expr)
  obj = proxy.obj(obj)
  observis = hasOwn.call(obj, bindObservis) ? obj[bindObservis] : (obj[bindObservis] = {})
  key = path.join(PATH_JOIN)
  return observis[key] || (observis[key] = new Observi(obj, expr, path))
}

function getObservi(obj, expr) {
  let bindObservis = cfg.bindObservis,
    path = parseExpr(expr),
    observis
  if (!path.length)
    throw new Error('Invalid Observi Expression: ' + expr)
  observis = hasOwn.call(obj, bindObservis) ? obj[bindObservis] : undefined
  return observis && observis[path.join(PATH_JOIN)]
}

export function createProxy(obj) {
  if (proxy.isEnable()) {
    var watcher = Observi.getOrCreateWatcher(obj)
    watcher.init()
    return watcher.proxy
  }
  return obj
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

export function eq(o1, o2) {
  return proxy.eq(o1, o2)
}

export function obj(o) {
  return proxy.obj(o)
}

export function $each(obj, callback, scope, own) {
  return hookArrayFunc(each, obj, callback, scope, own)
}

export function $map(obj, callback, scope, own) {
  return hookArrayFunc(map, obj, callback, scope, own)
}

export function $filter(obj, callback, scope, own) {
  return hookArrayFunc(filter, obj, callback, scope, own)
}

export function $aggregate(obj, callback, defVal, scope, own) {
  return aggregate(obj, callback && proxy.isEnable() ? function(r, v, k, s, o) {
    return callback.call(this, r, proxy.proxy(v), k, s, o)
  } : callback, defVal, scope, own)
}

export function $keys(obj, filter, scope, own) {
  return keys(obj, filter && proxy.isEnable() ? function(v, k, s, o) {
    return filter.call(this, proxy.proxy(v), k, s, o)
  } : filter, scope, own)
}

export function $values(obj, filter, scope, own) {
  return values(obj, filter && proxy.isEnable() ? function(v, k, s, o) {
    return filter.call(this, proxy.proxy(v), k, s, o)
  } : filter, scope, own)
}
