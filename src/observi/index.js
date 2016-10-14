import Observi from './Observi'
import proxy from './proxy'
import configuration from './configuration'
import {
  registerWatcher
} from './watcherFactory'
import Watcher from './Watcher'
import './watchers'
import _ from 'ilos'
import logger from './log'

configuration.register('bindObservis', '__observi__', 'init')

const cfg = configuration.get(),
  hasOwn = Object.prototype.hasOwnProperty,
  PATH_JOIN = '###'

function getOrCreateObservi(obj, expr) {
  let bindObservis = cfg.bindObservis,
    path = _.parseExpr(expr),
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
    path = _.parseExpr(expr),
    observis
  if (!path.length)
    throw new Error('Invalid Observi Expression: ' + expr)
  observis = hasOwn.call(obj, bindObservis) ? obj[bindObservis] : undefined
  return observis && observis[path.join(PATH_JOIN)]
}

const observi = {
  Watcher,
  registerWatcher,
  configuration,
  logger,
  proxy,
  on(obj, expr, cb) {
    if (!_.isFunc(cb))
      throw new Error('Invalid Observi Callback')
    let observi = getOrCreateObservi(proxy.obj(obj), expr)
    observi.on(cb)
    return observi.watcher.proxy
  },

  un(obj, expr, cb) {
    if (!_.isFunc(cb))
      throw new Error('Invalid Observi Callback')
    let observi = getObservi(proxy.obj(obj), expr)
    if (observi) {
      observi.un(cb)
      return observi.watcher.proxy
    }
    return obj
  },

  isListened(obj, expr, cb) {
    let observi = getObservi(proxy.obj(obj), expr)
    return observi && observi.isListened(cb)
  },

  eq(o1, o2) {
    return proxy.eq(o1, o2)
  },

  obj(o) {
    return proxy.obj(o)
  },

  $each(obj, callback, scope, own) {
    return hookArrayFunc(_.each, obj, callback, scope, own)
  },

  $map(obj, callback, scope, own) {
    return hookArrayFunc(_.map, obj, callback, scope, own)
  },

  $filter(obj, callback, scope, own) {
    return hookArrayFunc(_.filter, obj, callback, scope, own)
  },

  $aggregate(obj, callback, defVal, scope, own) {
    return _.aggregate(obj, callback && proxy.isEnable() ? function(r, v, k, s, o) {
      return callback.call(this, r, proxy.proxy(v), k, s, o)
    } : callback, defVal, scope, own)
  },

  $keys(obj, filter, scope, own) {
    return _.keys(obj, filter && proxy.isEnable() ? function(v, k, s, o) {
      return filter.call(this, proxy.proxy(v), k, s, o)
    } : filter, scope, own)
  },

  $values(obj, filter, scope, own) {
    return _.values(obj, filter && proxy.isEnable() ? function(v, k, s, o) {
      return filter.call(this, proxy.proxy(v), k, s, o)
    } : filter, scope, own)
  }
}

function hookArrayFunc(func, obj, callback, scope, own) {
  return func(obj, proxy.isEnable() ? callback && function(v, k, s, o) {
    return callback.call(this, proxy.proxy(v), k, s, o)
  } : callback, scope, own)
}

export default _.assignIf(_.create(observi), {
  observi: observi,
  ilos: _
}, _)
