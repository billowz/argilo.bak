import {
  isNil,
  isArrayLike
} from './is'
import {
  hasOwnProp,
  eq
} from './common'

function _eachObj(obj, callback, scope, own) {
  let key,
    isOwn,
    i = 0

  scope = scope || obj
  for (key in obj) {
    if ((isOwn = hasOwnProp(obj, key)) || own === false) {
      if (callback.call(scope, obj[key], key, obj, isOwn) === false)
        return false
      i++
    }
  }
  return i
}

function _eachArray(obj, callback, scope) {
  let i = 0,
    j = obj.length

  scope = scope || obj
  for (; i < j; i++) {
    if (callback.call(scope, obj[i], i, obj, true) === false)
      return false
  }
  return i
}

export function each(obj, callback, scope, own) {
  if (isArrayLike(obj)) {
    return _eachArray(obj, callback, scope)
  } else if (!isNil(obj)) {
    return _eachObj(obj, callback, scope, own)
  }
  return 0
}

export function map(obj, callback, scope, own) {
  let isArray = isArrayLike(obj),
    ret = isArray ? [] : {},
    each = isArray ? _eachArray : _eachObj

  each(obj, function(val, key) {
    ret[key] = callback.apply(this, arguments)
  }, scope, own)
  return ret
}

export function filter(obj, callback, scope, own) {
  let isArray = isArrayLike(obj),
    ret = isArray ? [] : {},
    each = isArray ? _eachArray : _eachObj

  each(obj, function(val, key) {
    if (callback.apply(this, arguments))
      isArray ? ret.push(val) : ret[key] = val
  })
  return ret
}

export function aggregate(obj, callback, defVal, scope, own) {
  let ret = defVal

  each(obj, function(val, key, obj, isOwn) {
    ret = callback.call(this, ret, val, key, obj, isOwn)
  }, scope, own)
  return ret
}

function _indexOfArray(array, val) {
  let i = 0,
    l = array.length

  for (; i < l; i++) {
    if (eq(array[i], val))
      return i
  }
  return -1
}

function _lastIndexOfArray(array, val) {
  let i = array.length

  while (i-- > 0) {
    if (eq(array[i], val))
      return i
  }
  return -1
}

function _indexOfObj(obj, val, own) {
  let key

  for (key in obj) {
    if (own === false || hasOwnProp(obj, key)) {
      if (eq(obj[key], val))
        return key
    }
  }
  return undefined
}

export function indexOf(obj, val, own) {
  if (isArrayLike(obj))
    return _indexOfArray(obj, val)
  return _indexOfObj(obj, val, own)
}

export function lastIndexOf(obj, val, own) {
  if (isArrayLike(obj))
    return _lastIndexOfArray(obj, val)
  return _indexOfObj(obj, val, own)
}

export function convert(obj, keyGen, valGen, scope, own) {
  let o = {}

  each(obj, function(val, key) {
    o[keyGen ? keyGen.apply(this, arguments) : key] = valGen ? valGen.apply(this, arguments) : val
  }, scope, own)
  return o
}

export function reverseConvert(obj, valGen, scope, own) {
  let o = {}

  each(obj, function(val, key) {
    o[val] = valGen ? valGen.apply(this, arguments) : key
  }, scope, own)
  return o
}
