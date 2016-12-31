import {
  isNil,
  isArrayLike
} from './is'
import {
  hasOwnProp,
  eq
} from './common'

export function eachObj(obj, callback, scope, own) {
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

export function eachArray(obj, callback, scope) {
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
    return eachArray(obj, callback, scope)
  } else if (!isNil(obj)) {
    return eachObj(obj, callback, scope, own)
  }
  return 0
}

export function map(obj, callback, scope, own) {
  let isArray = isArrayLike(obj),
    ret = isArray ? [] : {},
    each = isArray ? eachArray : eachObj

  each(obj, function(val, key) {
    ret[key] = callback.apply(this, arguments)
  }, scope, own)
  return ret
}

export function filter(obj, callback, scope, own) {
  let isArray = isArrayLike(obj),
    ret = isArray ? [] : {},
    each = isArray ? eachArray : eachObj

  each(obj, function(val, key) {
    if (callback.apply(this, arguments))
      isArray ? ret.push(val) : ret[key] = val
  })
  return ret
}

export function aggregate(obj, callback, val, scope, own) {
  let ret = val

  each(obj, function(val, key, obj, isOwn) {
    ret = callback.call(this, ret, val, key, obj, isOwn)
  }, scope, own)
  return ret
}

function _indexOfArray(array, cb, scope) {
  let i = 0,
    l = array.length

  for (; i < l; i++) {
    if (cb.call(scope || array, array[i], i, array, true))
      return i
  }
  return -1
}

function _lastIndexOfArray(array, cb, scope) {
  let i = array.length

  while (i-- > 0) {
    if (cb.call(scope || array, array[i], i, array, true))
      return i
  }
  return -1
}

function _indexOfObj(obj, cb, scope, own) {
  let key, isOwn

  for (key in obj) {
    if ((isOwn = hasOwnProp(obj, key)) || own === false) {
      if (cb.call(scope || obj, obj[key], key, obj, isOwn))
        return key
    }
  }
  return undefined
}

export function indexOf(obj, val, own) {
  var cmp = (v) => eq(v, val)
  if (isArrayLike(obj))
    return _indexOfArray(obj, cmp)
  return _indexOfObj(obj, cmp)
}

export function lastIndexOf(obj, val, own) {
  var cmp = (v) => eq(v, val)
  if (isArrayLike(obj))
    return _lastIndexOfArray(obj, cmp)
  return _indexOfObj(obj, cmp)
}

export function findIndex(obj, cb, scope, own) {
  if (isArrayLike(obj))
    return _indexOfArray(obj, cb, scope)
  return _indexOfObj(obj, cb, scope, own)
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
