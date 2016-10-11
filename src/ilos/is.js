import {
  hasOwnProp
} from './common'

const toStr = Object.prototype.toString

export const argsType = '[object Arguments]',
  arrayType = '[object Array]',
  funcType = '[object Function]',
  boolType = '[object Boolean]',
  numberType = '[object Number]',
  dateType = '[object Date]',
  stringType = '[object String]',
  objectType = '[object Object]',
  regexpType = '[object RegExp]',
  nodeListType = '[object NodeList]'

export function isDefine(obj) {
  return obj !== undefined
}

export function isNull(obj) {
  return obj === null
}

export function isNil(obj) {
  return obj === undefined || obj === null
}

export function isBool(obj) {
  return toStr.call(obj) == boolType
}

export function isNumber(obj) {
  return toStr.call(obj) == numberType
}

export function isDate(obj) {
  return toStr.call(obj) == dateType
}

export function isString(obj) {
  return toStr.call(obj) == stringType
}

export function isObject(obj) {
  return toStr.call(obj) == objectType
}

export function isArray(obj) {
  return toStr.call(obj) == arrayType
}

export function isArrayLike(obj) {
  let type = toStr.call(obj)
  switch (type) {
    case argsType:
    case arrayType:
    case stringType:
    case nodeListType:
      return true
  }
  if (obj) {
    var length = obj.length
    return isNumber(length) && (length === 0 || (length > 0 && hasOwnProp(obj, length - 1)))
  }
  return false
}

export function isFunc(obj) {
  return toStr.call(obj) == funcType
}

export function isRegExp(obj) {
  return toStr.call(obj) == regexpType
}

export function isPrimitive(obj) {
  if (isNil(obj)) return true
  let type = toStr.call(obj)
  switch (type) {
    case boolType:
    case numberType:
    case stringType:
    case funcType:
      return true
  }
  return false
}
