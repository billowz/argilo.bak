import {
  isNil
} from './is'
import {
  each
} from './collection'

const slice = Array.prototype.slice,
  firstLowerLetterReg = /^[a-z]/,
  ltrimReg = /^\s+/,
  rtrimReg = /\s+$/,
  trimReg = /(^\s+)|(\s+$)/g,
  thousandSeparationReg = /(\d)(?=(\d{3})+(?!\d))/g,
  // [index]    [flags]   [min-width]       [precision]         type
  // index$|$   ,-+#0     width|index$|*|$  .width|.index$|*|$  %sfducboxXeEgGpP
  formatReg = /%(\d+\$|\*|\$)?([-+#0, ]*)?(\d+\$?|\*|\$)?(\.\d+\$?|\.\*|\.\$)?([%sfducboxXeEgGpP])/g,
  pluralRegs = [{
    reg: /([a-zA-Z]+[^aeiou])y$/,
    rep: '$1ies'
  }, {
    reg: /([a-zA-Z]+[aeiou]y)$/,
    rep: '$1s'
  }, {
    reg: /([a-zA-Z]+[sxzh])$/,
    rep: '$1es'
  }, {
    reg: /([a-zA-Z]+[^sxzhy])$/,
    rep: '$1s'
  }],
  singularRegs = [{
    reg: /([a-zA-Z]+[^aeiou])ies$/,
    rep: '$1y'
  }, {
    reg: /([a-zA-Z]+[aeiou])s$/,
    rep: '$1'
  }, {
    reg: /([a-zA-Z]+[sxzh])es$/,
    rep: '$1'
  }, {
    reg: /([a-zA-Z]+[^sxzhy])s$/,
    rep: '$1'
  }]

function _uppercase(k) {
  return k.toUpperCase()
}

export function upperFirst(str) {
  return str.replace(firstLowerLetterReg, _uppercase)
}

export function ltrim(str) {
  return str.replace(ltrimReg, '')
}

export function rtrim(str) {
  return str.replace(rtrimReg, '')
}

export function trim(str) {
  return str.replace(trimReg, '')
}

export function plural(str) {
  let pluralReg
  for (let i = 0; i < 4; i++) {
    pluralReg = pluralRegs[i]
    if (pluralReg.reg.test(str))
      return str.replace(pluralReg.reg, pluralReg.rep)
  }
  return str
}

export function singular(str) {
  let singularReg
  for (let i = 0; i < 4; i++) {
    singularReg = singularRegs[i]
    if (singularReg.reg.test(str))
      return str.replace(singularReg.reg, singularReg.rep)
  }
  return str
}

export function thousandSeparate(number) {
  let split = (number + '').split('.')
  split[0] = split[0].replace(thousandSeparationReg, '$1,')
  return split.join('.')
}

// ========================== formatter ===========================
function pad(str, len, chr, leftJustify) {
  let l = str.length,
    padding = (l >= len) ? '' : Array(1 + len - l >>> 0).join(chr)

  return leftJustify ? str + padding : padding + str
}

function _format(str, args) {
  let index = 0

  // for min-width & precision
  function parseWidth(width) {
    if (!width) {
      width = 0
    } else if (width == '*') {
      width = +args[index++]
    } else if (width == '$') {
      width = +args[index]
    } else if (width.charAt(width.length - 1) == '$') {
      width = +args[width.slice(0, -1) - 1]
    } else {
      width = +width
    }
    return isFinite(width) ? width < 0 ? 0 : width : 0
  }

  // for index
  function parseArg(i) {
    if (!i || i == '*')
      return args[index++]
    if (i == '$')
      return args[index]
    return args[i.slice(0, -1) - 1]
  }

  str = str.replace(formatReg, function(match, i, flags, minWidth, precision, type) {
    if (type === '%') return '%'

    let value = parseArg(i)
    minWidth = parseWidth(minWidth)
    precision = precision && parseWidth(precision.slice(1))
    if (!precision && precision !== 0)
      precision = 'fFeE'.indexOf(type) == -1 ? (type == 'd') ? 0 : void(0) : 6

    let leftJustify = false,
      positivePrefix = '',
      zeroPad = false,
      prefixBaseX = false,
      thousandSeparation = false,
      prefix,
      base

    if (flags)
      each(flags, function(c) {
        switch (c) {
          case ' ':
          case '+':
            positivePrefix = c
            break
          case '-':
            leftJustify = true
            break
          case '0':
            zeroPad = true
            break
          case '#':
            prefixBaseX = true
            break
          case ',':
            thousandSeparation = true
            break
        }
      })
    switch (type) {
      case 'c':
        return String.fromCharCode(+value)
      case 's':
        if (isNil(value) && !isNaN(value))
          return ''
        value += ''
        if (precision && value.length > precision)
          value = value.slice(0, precision)
        if (value.length < minWidth)
          value = pad(value, minWidth, zeroPad ? '0' : ' ', false)
        return value
      case 'd':
        value = parseInt(value)
        if (isNaN(value))
          return ''
        if (value < 0) {
          prefix = '-'
          value = (-value)
        } else {
          prefix = positivePrefix
        }
        value += ''

        if (value.length < minWidth)
          value = pad(value, minWidth, '0', false)

        if (thousandSeparation)
          value = value.replace(thousandSeparationReg, '$1,')
        return prefix + value
      case 'e':
      case 'E':
      case 'f':
      case 'g':
      case 'G':
      case 'p':
      case 'P':
        {
          let number = +value
          if (isNaN(number))
            return ''
          if (number < 0) {
            prefix = '-'
            number = -number
          } else {
            prefix = positivePrefix
          }

          let method,
            ltype = type.toLowerCase()

          if ('p' != ltype) {
            method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(ltype)]
          } else {
            let sf = String(value).replace(/[eE].*|[^\d]/g, '')
            sf = (number ? sf.replace(/^0+/, '') : sf).length
            if (precision)
              precision = Math.min(precision, sf)
            method = (!precision || precision <= sf) ? 'toPrecision' : 'toExponential'
          }
          number = number[method](precision)

          if (number.length < minWidth)
            number = pad(number, minWidth, '0', false)
          if (thousandSeparation) {
            let split = number.split('.')
            split[0] = split[0].replace(thousandSeparationReg, '$1,')
            number = split.join('.')
          }
          value = prefix + number
          if ('EGP'.indexOf(type) != -1)
            return value.toUpperCase()
          return value
        }
      case 'b':
        base = 2
        break
      case 'o':
        base = 8
        break
      case 'u':
        base = 10
        break
      case 'x':
      case 'X':
        base = 16
        break
      case 'n':
        return ''
      default:
        return match
    }
    let number = value >>> 0
    prefix = prefixBaseX && base != 10 && number && ['0b', '0', '0x'][base >> 3] || ''
    number = number.toString(base)
    if (number.length < minWidth)
      number = pad(number, minWidth, '0', false)
    value = prefix + number
    if (type == 'X') return value.toUpperCase()
    return value
  })

  return {
    format: str, // format result
    count: index // format param count
  }
}

export function format(str) {
  return _format(str, slice.call(arguments, 1)).format
}

format.format = _format
