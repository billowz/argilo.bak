/*
 * String format
 *
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-07-25 14:57:08
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-11-05 15:57:16
 */
import { PROTOTYPE } from '../helper/constants'

const STR_ESCAPE_MAP = {
		'\n': '\\n',
		'\t': '\\t',
		'\f': '\\f',
		'"': '\\"',
	},
	STR_ESCAPE = /[\n\t\f"]/g

export function escapeString(str) {
	return str.replace(STR_ESCAPE, str => STR_ESCAPE_MAP[str])
}

export function pad(str, len, chr, leftAlign) {
	str = String(str)
	const l = str.length
	if (l >= len) return str

	const padding = new Array(len - l + 1).join(chr || ' ')
	return leftAlign ? str + padding : padding + str
}

function replacor(regs) {
	return function(str) {
		for (let i = 0, reg; i < 4; i++) {
			reg = regs[i]
			if (reg[0].test(str)) return str.replace(reg[0], reg[1])
		}
		return str
	}
}

export const plural = replacor([[/([a-zA-Z]+[^aeiou])y$/, '$1ies'], [/([a-zA-Z]+[aeiou]y)$/, '$1s'], [/([a-zA-Z]+[sxzh])$/, '$1es'], [/([a-zA-Z]+[^sxzhy])$/, '$1s']])

export const singular = replacor([[/([a-zA-Z]+[^aeiou])ies$/, '$1y'], [/([a-zA-Z]+[aeiou])s$/, '$1'], [/([a-zA-Z]+[sxzh])es$/, '$1'], [/([a-zA-Z]+[^sxzhy])s$/, '$1']])

const thousandSeparationReg = /(\d)(?=(\d{3})+(?!\d))/g
export function thousandSeparate(number) {
	let split = (number + '').split('.')
	split[0] = split[0].replace(thousandSeparationReg, '$1,')
	return split.join('.')
}

// ========================== formatter ===========================
// [index]    [flags]   [min-width]       [precision]         type
// index$|$   ,-+#0     width|index$|*|$  .width|.index$|*|$  %sfducboxXeEgGpP
const formatReg = /%(\d+\$|\*|\$)?([-+#0, ]*)?(\d+\$?|\*|\$)?(\.\d+\$?|\.\*|\.\$)?([%sfducboxXeEgGpP])/g
const slice = Array[PROTOTYPE].slice

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
		return isFinite(width) ? (width < 0 ? undefined : width) : undefined
	}

	// for index
	function parseArg(i) {
		if (!i || i == '*') return args[index++]
		if (i == '$') return args[index]
		return args[i.slice(0, -1) - 1]
	}

	str = str.replace(formatReg, function(match, idx, flags, minWidth, precision, type) {
		if (type === '%') return '%'

		let value = parseArg(idx)
		minWidth = parseWidth(minWidth)
		precision = precision && parseWidth(precision.slice(1))
		if (!precision && precision !== 0) precision = 'fFeE'.indexOf(type) == -1 && type == 'd' ? 0 : undefined

		let leftJustify = false,
			positivePrefix = '',
			zeroPad = false,
			prefixBaseX = false,
			thousandSeparation = false,
			prefix,
			base,
			c,
			i,
			j

		for (i = 0, j = flags && flags.length; i < j; i++) {
			c = flags.charAt(i)
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
		}
		switch (type) {
			case 'c':
				value = +value
				value = isNaN(value) || !isFinite(value) ? '' : String.fromCharCode(value)
				if (value.length < minWidth) value = pad(value, minWidth, zeroPad ? '0' : ' ', leftJustify)
				return value
			case 's':
				if (value === undefined || value === null || (typeof value === 'number' && (isNaN(value) || !isFinite(value)))) {
					value = ''
				} else {
					value += ''
					if (precision && value.length > precision) value = value.slice(0, precision)
				}
				if (value.length < minWidth) value = pad(value, minWidth, zeroPad ? '0' : ' ', leftJustify)
				return value
			case 'd':
				value = parseInt(value)
				if (isNaN(value) || !isFinite(value)) {
					value = ''
					prefix = positivePrefix
				} else {
					if (value < 0) {
						prefix = '-'
						value = -value
					} else {
						prefix = positivePrefix
					}
					value += ''
				}
				if (value.length < minWidth) value = pad(value, minWidth, '0', false)
				if (thousandSeparation) value = value.replace(thousandSeparationReg, '$1,')
				return prefix + value
			case 'e':
			case 'E':
			case 'f':
			case 'g':
			case 'G':
			case 'p':
			case 'P': {
				let number = +value
				if (isNaN(number) || !isFinite(value)) {
					number = ''
				} else {
					if (number < 0) {
						prefix = '-'
						number = -number
					} else {
						prefix = positivePrefix
					}

					switch (type.toLowerCase()) {
						case 'f':
							number = precision === undefined ? number + '' : number.toFixed(precision)
							break
						case 'e':
							number = number.toExponential(precision)
							break
						case 'g':
							number = precision === undefined ? number + '' : number.toPrecision(precision)
							break
						case 'p':
							if (precision !== undefined) {
								let sf = String(value).replace(/[eE].*|[^\d]/g, '')
								sf = (number ? sf.replace(/^0+/, '') : sf).length
								precision = Math.min(precision, sf)
								number = number[!precision || precision <= sf ? 'toPrecision' : 'toExponential'](precision)
							} else {
								number += ''
							}
							break
					}
				}
				if (number.length < minWidth) number = pad(number, minWidth, '0', false)
				if (thousandSeparation) {
					let split = number.split('.')
					split[0] = split[0].replace(thousandSeparationReg, '$1,')
					number = split.join('.')
				}
				value = prefix + number
				if ('EGP'.indexOf(type) != -1) return value.toUpperCase()
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
		prefix = (prefixBaseX && base != 10 && number && ['0b', '0', '0x'][base >> 3]) || ''
		number = number.toString(base)
		if (number.length < minWidth) number = pad(number, minWidth, '0', false)
		value = prefix + number
		if (type == 'X') return value.toUpperCase()
		return value
	})

	return {
		format: str, // format result
		count: index, // format param count
	}
}

export function format(str) {
	return _format(str, slice.call(arguments, 1)).format
}

format.format = _format
