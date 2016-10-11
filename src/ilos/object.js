import {
  isNil,
  arrayType,
  stringType
} from './is'
import {
  hasOwnProp,
  emptyFunc
} from './common'
import {
  each
} from './collection'

const toStr = Object.prototype.toString,
  exprCache = {},
  exprReg = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
  escapeCharReg = /\\(\\)?/g

export function keys(obj, filter, scope, own) {
  let keys = []

  each(obj, function(val, key) {
    if (!filter || filter.apply(this, arguments))
      keys.push(key)
  }, scope, own)
  return keys
}

export function values(obj, filter, scope, own) {
  let values = []

  each(obj, function(val, key) {
    if (!filter || filter.apply(this, arguments))
      values.push(val)
  }, scope, own)
  return values
}

export function getOwnProp(obj, key, defaultVal) {
  return hasOwnProp(obj, key) ? obj[key] : defaultVal
}

export const prototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(obj) {
  return obj.__proto__
}

export const setPrototypeOf = Object.setPrototypeOf || function setPrototypeOf(obj, proto) {
  obj.__proto__ = proto
}

export const assign = Object.assign || function assign(target) {
  let source,
    key,
    i = 1,
    l = arguments.length

  for (; i < l; i++) {
    source = arguments[i]
    for (key in source) {
      if (hasOwnProp(source, key))
        target[key] = source[key]
    }
  }
  return target
}

export function assignIf(target) {
  let source,
    key,
    i = 1,
    l = arguments.length

  for (; i < l; i++) {
    source = arguments[i]
    for (key in source) {
      if (hasOwnProp(source, key) && !hasOwnProp(target, key))
        target[key] = source[key]
    }
  }
  return target
}

export const create = Object.create || function(parent, props) {
  emptyFunc.prototype = parent
  let obj = new emptyFunc()
  emptyFunc.prototype = undefined
  if (props)
    each(props, (prop, name) => {
      obj[name] = prop.value
    })
  return obj
}

export function parseExpr(expr, cache) {
  let ret,
    type = toStr.call(expr)

  if (type == arrayType) return expr
  if (type != stringType) return []
  if (ret = exprCache[expr]) return ret

  ret = cache !== false ? (exprCache[expr] = []) : []
  expr.replace(exprReg, function(match, number, quote, string) {
    ret.push(quote ? string.replace(escapeCharReg, '$1') : (number || match))
  })
  return ret
}

export function get(obj, expr, defVal, own, cache) {
  let i = 0,
    path = parseExpr(expr, cache),
    l = path.length - 1,
    prop

  for (; i < l && !isNil(obj); i++) {
    prop = path[i]
    if (own && !hasOwnProp(obj, prop))
      return defVal
    obj = obj[prop]
  }
  prop = path[i]
  return (i == l && !isNil(obj) && (!own || hasOwnProp(obj, prop))) ? obj[prop] : defVal
}

export function has(obj, expr, own, cache) {
  let i = 0,
    path = parseExpr(expr, cache),
    l = path.length - 1,
    prop

  for (; i < l && !isNil(obj); i++) {
    prop = path[i]
    if (own && !hasOwnProp(obj, prop))
      return false
    obj = obj[prop]
  }
  prop = path[i]
  return i == l && !isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj)
}

export function set(obj, expr, value) {
  let i = 0,
    path = parseExpr(expr, true),
    l = path.length - 1,
    prop = path[0],
    _obj = obj,
    val

  while (i++ < l) {
    val = _obj[prop]
    _obj = isNil(val) ? (_obj[prop] = {}) : val
    prop = path[i]
  }
  _obj[prop] = value
  return obj
}
