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

export function typestr(obj) {
  return toStr.call(obj)
}

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
  return typestr(obj) == boolType
}

export function isNumber(obj) {
  return typestr(obj) == numberType
}

export function isDate(obj) {
  return typestr(obj) == dateType
}

export function isString(obj) {
  return typestr(obj) == stringType
}

export function isObject(obj) {
  return typestr(obj) == objectType
}

export function isArray(obj) {
  return typestr(obj) == arrayType
}

export function isArrayLike(obj, type) {
  switch (type || typestr(obj)) {
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

let emptyStrReg = /^\s*$/
export function isEmptyStr(str) {
  return emptyStrReg.test(str)
}

export function isEmptyObj(obj) {
  for (var k in obj)
    return false
  return true
}

export function isEmpty(obj, type) {
  if (isNil(obj))
    return true
  type = type || typestr(obj)
  switch (type) {
    case stringType:
      return isEmptyStr(obj)
    case objectType:
      return isEmptyObj(obj)
    default:
      if (isArrayLike(obj, type))
        return !obj.length
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
