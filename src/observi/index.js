import proxy from './proxy'
import Watcher from './Watcher'
import Observi from './Observi'
import configuration from './configuration'
import {
  registerWatcher
} from './watcherFactory'
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
import logger from './log'

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

function observe(obj, expr, cb) {
  if (!isFunc(cb))
    throw new Error('Invalid Observi Callback')
  let observi = getOrCreateObservi(proxy.obj(obj), expr)
  observi.on(cb)
  return observi.watcher.proxy
}

function unobserve(obj, expr, cb) {
  if (!isFunc(cb))
    throw new Error('Invalid Observi Callback')
  let observi = getObservi(proxy.obj(obj), expr)
  if (observi) {
    observi.un(cb)
    return observi.watcher.proxy
  }
  return obj
}

function isObserved(obj, expr, cb) {
  let observi = getObservi(proxy.obj(obj), expr)
  return observi && observi.isListened(cb)
}

function eq(o1, o2) {
  return proxy.eq(o1, o2)
}

function obj(o) {
  return proxy.obj(o)
}

function $each(obj, callback, scope, own) {
  return hookArrayFunc(each, obj, callback, scope, own)
}

function $map(obj, callback, scope, own) {
  return hookArrayFunc(map, obj, callback, scope, own)
}

function $filter(obj, callback, scope, own) {
  return hookArrayFunc(filter, obj, callback, scope, own)
}

function $aggregate(obj, callback, defVal, scope, own) {
  return aggregate(obj, callback && proxy.isEnable() ? function(r, v, k, s, o) {
    return callback.call(this, r, proxy.proxy(v), k, s, o)
  } : callback, defVal, scope, own)
}

function $keys(obj, filter, scope, own) {
  return keys(obj, filter && proxy.isEnable() ? function(v, k, s, o) {
    return filter.call(this, proxy.proxy(v), k, s, o)
  } : filter, scope, own)
}

function $values(obj, filter, scope, own) {
  return values(obj, filter && proxy.isEnable() ? function(v, k, s, o) {
    return filter.call(this, proxy.proxy(v), k, s, o)
  } : filter, scope, own)
}

export {
  Watcher,
  registerWatcher,
  logger,
  proxy,
  configuration,
  observe,
  unobserve,
  isObserved,
  eq,
  obj,
  $each,
  $map,
  $filter,
  $aggregate,
  $keys,
  $values
}
