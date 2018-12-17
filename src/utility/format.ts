/**
 * @module utility/format
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 03 2018 19:46:41 GMT+0800 (China Standard Time)
 * @modified Mon Dec 17 2018 19:24:20 GMT+0800 (China Standard Time)
 */

import { createFn } from './fn'
import { isFn } from './is'
import { get, parsePath } from './propPath'
import { create } from './create'
import { charCode, upper, escapeStr } from './string'

//========================================================================================
/*                                                                                      *
 *                                       pad & cut                                      *
 *                                                                                      */
//========================================================================================

export function pad(str: string, len: number, chr?: string, leftAlign?: boolean | number): string {
	return len > str.length ? __pad(str, len, chr, leftAlign) : str
}

export function cut(str: string, len: number, suffix?: string): string {
	return len < str.length ? ((suffix = suffix || ''), str.substr(0, len - suffix.length) + suffix) : str
}

function __pad(str: string, len: number, chr: string, leftAlign: boolean | number): string {
	const padding = new Array(len - str.length + 1).join(chr || ' ')
	return leftAlign ? str + padding : padding + str
}

//========================================================================================
/*                                                                                      *
 *                                       Separator                                      *
 *                                                                                      */
//========================================================================================

export const thousandSeparate = mkSeparator(3),
	binarySeparate = mkSeparator(8, '01'),
	octalSeparate = mkSeparator(4, '0-7'),
	hexSeparate = mkSeparator(4, '\\da-fA-F')

function mkSeparator(group: number, valReg?: string): (numStr: string) => string {
	valReg = valReg || '\\d'
	const reg = new RegExp(
		`^(?:[+-]|\\s+|0[xXbBoO])|([${valReg}])(?=([${valReg}]{${group}})+(?![${valReg}]))|[^${valReg}].*`,
		'g'
	)
	return numStr => numStr.replace(reg, separatorHandler)
}
function separatorHandler(m, d) {
	return d ? d + ',' : m
}

//========================================================================================
/*                                                                                      *
 *                                   plural & singular                                  *
 *                                                                                      */
//========================================================================================

const PLURAL_REG = /([a-zA-Z]+)([^aeiou])y$|([sxzh])$|([aeiou]y)$|([^sxzhy])$/
export function plural(str: string): string {
	return str.replace(PLURAL_REG, pluralHandler)
}
function pluralHandler(m, v, ies, es, ys, s) {
	return v + (ies ? ies + 'ies' : es ? es + 'es' : (ys || s) + 's')
}

const SINGULAR_REG = /([a-zA-Z]+)([^aeiou])ies$|([sxzh])es$|([aeiou]y)s$|([^sxzhy])s$/
export function singular(str: string): string {
	return str.replace(SINGULAR_REG, singularHandler)
}
function singularHandler(m, v, ies, es, ys, s) {
	return v + (ies ? ies + 'y' : es || ys || s)
}

//========================================================================================
/*                                                                                      *
 *                                     format flags                                     *
 *                                                                                      */
//========================================================================================

type FormatFlags = number

export const FORMAT_XPREFIX: FormatFlags = 0x1
export const FORMAT_PLUS: FormatFlags = 0x2
export const FORMAT_ZERO: FormatFlags = 0x4
export const FORMAT_SPACE: FormatFlags = 0x8
export const FORMAT_SEPARATOR: FormatFlags = 0x10
export const FORMAT_LEFT: FormatFlags = 0x20

const FLAG_MAPPING = {
	'#': FORMAT_XPREFIX,
	'+': FORMAT_PLUS,
	'0': FORMAT_ZERO,
	' ': FORMAT_SPACE,
	',': FORMAT_SEPARATOR,
	'-': FORMAT_LEFT
}
function parseFlags(f: string): FormatFlags {
	let flags: FormatFlags = 0
	if (f) {
		var i = f.length
		while (i--) flags |= FLAG_MAPPING[f.charAt(i)]
	}
	return flags
}

//========================================================================================
/*                                                                                      *
 *                                      format Rule                                     *
 *                                                                                      */
//========================================================================================

//   0      1      2     3     4       5       6           7         8      9           10             11             12        13
// [match, expr, index, prop, flags, width, width-idx, width-prop, fill, precision, precision-idx, precision-prop, cut-suffix, type]
const paramIdxR = `(\\d+|\\$|@)`,
	paramPropR = `(?:\\{((?:[a-zA-Z$_][\\w$_]*|\\[(?:\\d+|"(?:[^\\\\"]|\\\\.)*"|'(?:[^\\\\']|\\\\.)*')\\])(?:\\.[a-zA-Z$_][\\w$_]*|\\[(?:\\d+|"(?:[^\\\\"]|\\\\.)*"|'(?:[^\\\\']|\\\\.)*')\\])*)\\})`,
	widthR = `(?:([1-9]\\d*)|&${paramIdxR}${paramPropR})`,
	fillR = `(?:=(.))`,
	cutSuffixR = `(?:="((?:[^\\\\"]|\\\\.)*)")`,
	formatReg = new RegExp(
		`\\\\.|(\\{${paramIdxR}?${paramPropR}?(?::([#,+\\- 0]*)(?:${widthR}${fillR}?)?(?:\\.${widthR}${cutSuffixR}?)?)?([a-zA-Z_][a-zA-Z0-9_$]*)?\\})`,
		'g'
	)

//========================================================================================
/*                                                                                      *
 *                                      Formatters                                      *
 *                                                                                      */
//========================================================================================

type FormatCallback = (
	val: any,
	flags: FormatFlags,
	width: number,
	fill: string,
	precision: number,
	cutSuffix: string
) => string

const formatters: {
	[k: string]: FormatCallback
} = create(null)

export function extendFormatter(obj: { [key: string]: FormatCallback }) {
	var fmt, name
	for (name in obj) {
		fmt = obj[name]
		isFn(fmt) && (formatters[name] = fmt)
	}
}

export function getFormatter(name: string): FormatCallback {
	const f = formatters[name || 's']
	if (f) return f
	throw new Error(`Invalid Formatter: ${name}`)
}

//========================================================================================
/*                                                                                      *
 *                           format by every parameter object                           *
 *                                                                                      */
//========================================================================================

/**
 * Syntax:
 * @example
 * 	'{'
 * 		(<parameter>)?
 * 		(
 * 			':'
 * 			(<flags>)?
 * 			(
 * 				<width> ('=' <fill-char>)?
 * 			)?
 * 			(
 * 				'.'
 * 				<precision> ('=' '"' <cut-suffix> '"')?
 * 			)?
 * 		)?
 * 		(<type>)?
 * 	'}'
 *
 * - parameter
 * 		- {}					format by next unused argument
 * 		- {<number>}			format by arguments[number]
 * 		- {@}					format by current used argument
 * 		- {$}					format by next unused argument
 * 		- {{name}}				format by "name" property on next unused argument
 * 		- {<number>{name}}		format by "name" property on arguments[number]
 * 		- {@{name}}				format by "name" property on current used argument
 * 		- {${name}}				format by "name" property on next unused argument
 * @example
 * 		format('<{} {}>', 'abc')				// return "<abc undefined>"
 * 		format('<{$} {$}>', 'abc')				// return "<abc undefined>"
 * 		format('<{@} {} {@}>', 'abc')			// return "<abc abc abc>"
 * 		format('<{0} {} {0}>', 'abc')			// return "<abc abc abc>"
 * 		format('<{0{value}} {${value}} {@{value}} {{value.a}}>', {value: 'abc'}, {value: {a: 'cbd'}})
 * 		// return "<abc abc abc bcd>"
 * 		format('<{0{[0]}} {${[0]}} {@{[0]}} {{[0].a}}>', ['abc'], [{a: 'cbd'}])
 * 		// return "<abc abc abc bcd>"
 *
 * - flags
 * 		- {:#}    	FORMAT_XPREFIX
 * 					ensure the leading "0" for any octal
 * 					prefix non-zero hexadecimal with "0x" or "0X"
 * 					prefix non-zero binary with "0b" or "0B"
 * 		- {:+}    	FORMAT_PLUS
 * 					Forces to preceed the result with a plus or minus sign (+ or -) even for positive numbers.
 * 					By default, only negative numbers are preceded with a - sign
 * 		- {:0}		FORMAT_ZERO
 * 					Left-pads the number with zeroes (0) instead of spaces when padding is specified
 * 		- {: }   	FORMAT_SPACE
 * 					If no sign is going to be written, a blank space is inserted before the value
 * 		- {:,}		FORMAT_SEPARATOR
 * 					use thousand separator on decimal number
 * 					hexadecimal number: FFFFFFFF => FFFF,FFFF
 * 					octal number: 77777777 => 7777,7777
 * 					binary number: 1111111111111111 => 11111111,11111111
 * 		{:-}    	FORMAT_LEFT
 * 					Left-justify within the given field width; Right justification is the default
 * @example
 * 		format('<{: d}>',  12);		// return "< 12>"
 *		format('<{: d}>',   0);		// return "< 0>"
 *		format('<{: d}>', -12);		// return "<-12>"
 *		format('<{:+d}>',  12);		// return "<+12>"
 *		format('<{:+d}>',   0);		// return "<+0>"
 *		format('<{:+d}>', -12);		// return "<-12>"
 *		format('<{:6s}>',  12);		// return "<    12>"
 *		format('<{:-6s}>', 12);		// return "<12    >"
 *		format('<{:#o}>',  12);		// return "<014>"
 *		format('<{:#x}>',  12);		// return "<0xc>"
 *		format('<{:#X}>',  12);		// return "<0XC>"
 *		format('<{:#b}>',  12);		// return "<0b1100>"
 *		format('<{:#B}>',  12);		// return "<0B1100>"

 * - width
 * 		Minimum number of characters to be printed.
 * 		If the value to be printed is shorter than this number, the result is padded with pad char(default is space).
 * 		The value is not truncated even if the result is larger.
 *		- width value
 * 			{:<number>}
 * 			{:&@}
 * 			{:&$}
 * 			{:&<number>}
 * 			{:&@{<prop>}}
 * 			{:&${<prop>}}
 * 			{:&<number>{<prop>}}
 *		- pad char
 * 			{:&@=<pad-char>}
 * 			{:&$=<pad-char>}
 * 			{:&<number>=<pad-char>}
 * 			{:&@{<prop>}=<pad-char>}
 * 			{:&${<prop>}=<pad-char>}
 * 			{:&<number>{<prop>}=<pad-char>}
 * @example
 *
 * - precision
 * 		For integer specifiers (d,  o, u, x, X): precision specifies the minimum number of digits to be written.
 * 		If the value to be written is shorter than this number, the result is padded with leading zeros.
 * 		The value is not truncated even if the result is longer. A precision of 0 means that no character is written for the value 0.
 * 		For a, A, e, E, f and F specifiers: this is the number of digits to be printed after the decimal point (by default, this is 6).
 * 		For g and G specifiers: This is the maximum number of significant digits to be printed.
 * 		For s: this is the maximum number of characters to be printed. By default all characters are printed until the ending null character is encountered.
 * 		If the period is specified without an explicit value for precision, 0 is assumed.
 * 		- precision value
 * 			{:.<number>}
 * 			{:.&@}
 * 			{:.&$}
 * 			{:.&<number>}
 * 			{:.&@{<prop>}}
 * 			{:.&${<prop>}}
 * 			{:.&<number>{<prop>}}
 * 		- cut suffix
 * 			{:.&@="<suffix>"}
 * 			{:.&$="<suffix>"}
 * 			{:.&<number>="<suffix>"}
 * 			{:.&@{<prop>}="<suffix>"}
 * 			{:.&${<prop>}="<suffix>"}
 * 			{:.&<number>{<prop>}="<suffix>"}
 * - type
 * 		- default types
 *			- {c}		Character
 * 			- {s}		String
 * 			- {j}		JSON String
 * 			- {y}		Date Year
 * 			- {m}		Date Month
 * 			- {w}		Date Weekly
 * 			- {W}		Date Weekly
 * 			- {D}		Date
 * 			- {H}		Date
 * 			- {M}		Date
 * 			- {S}		Date
 * 			- {d} 		Signed decimal integer
 *			- {u}		Unsigned decimal integer
 *			- {o}		Unsigned octal
 *			- {x}		Unsigned hexadecimal integer
 *			- {X}		Unsigned hexadecimal integer (uppercase)
 *			- {f}		Decimal floating point, lowercase,
 *			- {e}		Scientific notation (mantissa/exponent), lowercase
 *			- {E}		Scientific notation (mantissa/exponent), uppercase
 *			- {g}		Use the shortest representation: %e or %f
 *			- {G}		Use the shortest representation: %E or %F
 * - Rules
 * 		- property-path
 * 				(
 * 					(?:
 * 						[a-zA-Z$_][\w$_]*|
 * 						\[
 * 						(?:
 * 							\d+|
 * 							"(?:[^\\"]|\\.)*"|
 * 							'(?:[^\\']|\\.)*'
 * 						)
 * 						\]
 * 					)
 * 					(?:
 * 						\.[a-zA-Z$_][\w$_]*|
 * 						\[
 * 						(?:
 * 							\d+|
 * 							"(?:[^\\"]|\\.)*"|
 * 							'(?:[^\\']|\\.)*'
 * 						)
 * 						\]
 * 					)*
 * 				)
 * 		- expression
 * 			/\\.|												// escape
 * 			(													// 1: expression
 * 				\{
 * 				(\d+|\$|@)?										// 2: parameter index
 * 				(?:\{<property-path>\})?						// 3: property path of parameter
 * 				(?:
 * 					:
 * 					([#,+\- ]*)									// 4: flags
 * 					(?:
 * 						(?:
 * 							(\d+)|								// 5: width
 * 							(?:
 * 								&
 * 								(\d+|\$|@)						// 6: parameter index of width
 * 								(?:\{<property-path>\})?		// 7: property path of width parameter
 * 							)
 * 						)
 * 						(?:=(.))?								// 8: pad fill
 * 					)?
 * 					(?:
 * 						\.
 * 						(?:
 * 							(\d+)|								// 9: width
 * 							(?:
 * 								&
 * 								(\d+|\$|@)						// 10: parameter index of width
 * 								(?:\{<property-path>\})?		// 11: property path of width parameter
 * 							)
 * 						)
 * 						(?:
 * 							=
 * 							"
 * 							((?:[^\\"]|\\.)*)					// 12: cut su
 * 							"
 * 						)
 * 					)?
 * 				)?
 * 				([a-zA-Z_][a-zA-Z0-9_$]*)?						// 13: data type
 * 				\}
 * 			)/
 * @param fmt 		format String
 * @param args		format arguments
 * @param offset	start offset of arguments
 * @param getParam	get parameter on arguments callback
 */
export function vformat<T>(fmt: string, args: T, offset?: number, getParam?: (args: T, idx: number) => any): string {
	offset = offset || 0
	const start = offset
	getParam = getParam || defaultGetParam
	return fmt.replace(formatReg, function(
		s,
		m,
		param,
		paramProp,
		flags,
		width,
		widx,
		wprop,
		fill,
		precision,
		pidx,
		pprop,
		cutSuffix,
		type
	) {
		if (!m) return s.charAt(1)
		return getFormatter(type)(
			parseParam(param || '$', paramProp),
			parseFlags(flags),
			parseWidth(width, widx, wprop) || 0,
			fill,
			parseWidth(precision, pidx, pprop),
			cutSuffix
		)
	})

	function parseWidth<T>(width: string, idx: string, prop: string): number {
		if (width) return (width as any) >> 0
		if (idx) {
			const w = parseParam(idx, prop) >> 0
			if (isFinite(w)) return w
		}
	}

	function parseParam<T>(paramIdx: string, prop: string): any {
		let param = getParam(
			args,
			paramIdx === '$'
				? offset++
				: paramIdx === '@'
				? offset === start
					? offset
					: offset - 1
				: (paramIdx as any) >> 0
		)
		return prop ? get(param, prop) : param
	}
}

function defaultGetParam(args: any, idx: number) {
	return args[idx]
}

//========================================================================================
/*                                                                                      *
 *                                        format                                        *
 *                                                                                      */
//========================================================================================

/**
 * @see vformat
 * @param fmt	format string
 * @param args	format arguments
 */
export function format(fmt: string, ...args: any): string
export function format(fmt: string): string {
	return vformat(fmt, arguments, 0, getFormatParam)
}

function getFormatParam(args: IArguments, idx: number) {
	return args[idx + 1]
}

//========================================================================================
/*                                                                                      *
 *                                       formatter                                      *
 *                                                                                      */
//========================================================================================

const GET_PARAM_VAR = 'getp',
	GET_PROP_VAR = 'get',
	STATE_VAR = 'state'
function createFormatter(m: string[], getParam?: (args: IArguments, idx: number) => any) {
	return createFn(
		`return function(args, ${STATE_VAR}){
return fmt(${getParamCode(m[2] || '$', m[3])},
"${parseFlags(m[4])}",
${getWidthCode(m[5], m[6], m[7], '0')},
"${m[8] ? escapeStr(m[8]) : ' '}",
${getWidthCode(m[9], m[10], m[11], 'void 0')},
"${m[12] ? escapeStr(m[12]) : ''}");
}`,
		['fmt', GET_PROP_VAR, GET_PARAM_VAR]
	)(getFormatter(m[13]), get, getParam)
}

function getWidthCode(width: string, idx: string, prop: string, def: string): string {
	return width ? width : idx ? getParamCode(idx, prop) : def
}

function getParamCode(idx: string, prop: string): string {
	let code = `${GET_PARAM_VAR}(args, ${
		idx === '$'
			? `${STATE_VAR}[0]++`
			: idx === '@'
			? `${STATE_VAR}[0] === ${STATE_VAR}[1] ? ${STATE_VAR}[0] : ${STATE_VAR}[0] - 1`
			: idx
	})`
	if (prop) {
		const path = parsePath(prop)
		var i = path.length
		while (i--) path[i] = `"${escapeStr(path[i])}"`
		return `${GET_PROP_VAR}(${code}, [${path.join(', ')}])`
	}
	return code
}
/**
 * @see vformat
 * @param fmt		format string
 * @param offset	start offset of arguments
 * @param getParam	get parameter on arguments callback
 */
export function formatter(
	fmt: string,
	offset?: number,
	getParam?: (args: IArguments, idx: number) => any
): (...args: any[]) => string {
	let m,
		lastIdx = 0,
		mStart,
		mEnd,
		arr = [],
		codes = [],
		i = 0
	offset = offset || 0
	while ((m = formatReg.exec(fmt))) {
		mEnd = formatReg.lastIndex
		mStart = mEnd - m[0].length
		lastIdx < mStart && pushStr(fmt.substring(lastIdx, mStart), 0)
		if (m[1]) {
			codes[i] = `arr[${i}](arguments, ${STATE_VAR})`
			arr[i++] = createFormatter(m, getParam || defaultGetParam)
		} else {
			pushStr(m[0].charAt(1), i)
		}
		lastIdx = mEnd
	}
	lastIdx < fmt.length && pushStr(fmt.substring(lastIdx), i)
	return createFn(`return function(){var ${STATE_VAR} = [${offset}, ${offset}]; return ${codes.join(' + ')}}`, [
		'arr'
	])(arr)

	function pushStr(str, append) {
		if (append && arr[i - 1].match) {
			arr[i - 1] += str
		} else {
			codes[i] = `arr[${i}]`
			arr[i++] = str
		}
	}
}
/*
setTimeout(() => {
	var f,
		n = 100000
	console.time()
	for (var i = 0; i < n; i++) {
		f = formatter(`{:.10="..."}`)
	}
	console.timeEnd()
	console.time()
	for (var i = 0; i < n; i++) {
		f('abbdddded')
	}
	console.timeEnd()
	console.time()
	for (var i = 0; i < n; i++) {
		format(`{:.10="..."}`, 'abbdddded')
	}
	console.timeEnd()
	console.log(formatter(`{:.10="..."}`).toString())
}) */
//========================================================================================
/*                                                                                      *
 *                                  default formatters                                  *
 *                                                                                      */
//========================================================================================

function strFormatter(toStr: (val: any, flags: FormatFlags) => string): FormatCallback {
	return function(val, flags, width, fill, precision, cutSuffix) {
		const str = toStr(val, flags)
		return width > str.length ? __pad(str, width, fill, flags & FORMAT_LEFT) : cut(str, precision, cutSuffix)
	}
}

function numFormatter(
	parseNum: (val: any) => number,
	getPrefix: (num: number, flags: FormatFlags) => string,
	toStr: (num: number, flags: FormatFlags, precision: number) => string,
	separator: (numStr: string) => string
): FormatCallback {
	return function(val, flags, width, fill, precision) {
		const num = parseNum(val)
		if (!isFinite(num)) return String(num)

		const prefix = getPrefix(num, flags),
			plen = prefix.length
		let str = toStr(num < 0 ? -num : num, flags, precision)

		return flags & FORMAT_ZERO
			? ((str = prefix + pad(str, width - plen, '0')), flags & FORMAT_SEPARATOR ? separator(str) : str)
			: (flags & FORMAT_SEPARATOR && (str = separator(str)), pad(prefix + str, width, fill, flags & FORMAT_LEFT))
	}
}

function decimalPrefix(num: number, flags: FormatFlags): string {
	return num < 0 ? '-' : flags & FORMAT_PLUS ? '+' : flags & FORMAT_SPACE ? ' ' : ''
}

//──── base formatter ───────────────────────────────────────────────────────────────────────
const BASE_RADIXS = {
	b: [2, binarySeparate],
	o: [8, octalSeparate],
	u: [10, thousandSeparate],
	x: [16, hexSeparate]
}
const BASE_PREFIXS = ['0b', '0o', '0x']
function baseFormatter(type: string): FormatCallback {
	const base = BASE_RADIXS[type.toLowerCase()],
		n = base[0],
		__toStr = num => num.toString(n),
		toStr = type === 'X' ? num => upper(__toStr(num)) : __toStr
	let xprefix = n === 10 ? '' : BASE_PREFIXS[n >> 3]
	charCode(type) < 96 && (xprefix = upper(xprefix))
	return numFormatter(v => v >>> 0, (num, flags) => (flags & FORMAT_XPREFIX ? xprefix : ''), toStr, base[1])
}

//──── float formatter ───────────────────────────────────────────────────────────────────
function floatFormatter(type: string): FormatCallback {
	const ____toStr = upper(type) === 'E' ? toExponential : type === 'f' ? toFixed : toPrecision,
		__toStr = (num, flags, precision) => ____toStr(num, precision) || String(num),
		toStr = charCode(type) > 96 ? __toStr : (num, flags, precision) => upper(__toStr(num, flags, precision))
	return numFormatter(parseFloat, decimalPrefix, toStr, thousandSeparate)
}

function toExponential(num: number, precision: number): string {
	return num.toExponential(precision)
}
function toPrecision(num: number, precision: number): string {
	return precision && num.toPrecision(precision)
}
function toFixed(num: number, precision: number): string {
	return precision >= 0 && num.toFixed(precision)
}

//──── register formatters ───────────────────────────────────────────────────────────────
extendFormatter({
	s: strFormatter(toStr),
	j: strFormatter(v =>
		v === undefined || isFn(v) || (v.toJSON && v.toJSON() === undefined) ? toStr(v) : JSON.stringify(v)
	),
	c(val: any) {
		const num = val >> 0
		return num > 0 ? String.fromCharCode(num) : ''
	},
	d: numFormatter(val => val >> 0, decimalPrefix, toStr, thousandSeparate),
	e: floatFormatter('e'),
	E: floatFormatter('E'),
	f: floatFormatter('f'),
	g: floatFormatter('g'),
	G: floatFormatter('G'),
	b: baseFormatter('b'),
	B: baseFormatter('B'),
	o: baseFormatter('o'),
	O: baseFormatter('O'),
	u: baseFormatter('u'),
	x: baseFormatter('x'),
	X: baseFormatter('X')
})

function toStr(v: any): string {
	return String(v)
}
