/**
 * @module utility/format
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 03 2018 19:46:41 GMT+0800 (China Standard Time)
 * @modified Thu Dec 06 2018 20:10:18 GMT+0800 (China Standard Time)
 */

import { createFn } from './fn'
import { isFn } from './is'
import { get, parsePath } from './propPath'
import create from './create'
import { pad, thousandSeparationReg, charCode } from './string'

//========================================================================================
/*                                                                                      *
 *                                      format Rule                                     *
 *                                                                                      */
//========================================================================================

//   0      1      2     3     4       5       6           7         8      9           10             11             12      13
// [match, expr, index, prop, flags, width, width-idx, width-prop, fill, precision, precision-idx, precision-prop, cut-fill, type]
const paramIdxR = `(\\d+|\\$|@)`,
	paramPropR = `(?:\\{((?:[a-zA-Z$_][\\w$_]*|\\[(?:\\d+|"(?:[^\\\\"]|\\\\.)*"|'(?:[^\\\\']|\\\\.)*')\\])(?:\\.[a-zA-Z$_][\\w$_]*|\\[(?:\\d+|"(?:[^\\\\"]|\\\\.)*"|'(?:[^\\\\']|\\\\.)*')\\])*)\\})`,
	widthR = `(?:([1-9]\\d*)|&${paramIdxR}${paramPropR})`,
	fillR = `(?:=(.))`,
	cutSuffixR = `(?:="((?:[^\\\\"]|\\\\.)*)")`,
	formatReg = new RegExp(
		`\\\\.|(\\{${paramIdxR}?${paramPropR}?(?::([#,+\\- 0]*)(?:${widthR}${fillR}?)?(?:\\.${widthR}${cutSuffixR}?)?)?(?::?([a-zA-Z_][a-zA-Z0-9_$]*))?\\})`,
		'g'
	)

//========================================================================================
/*                                                                                      *
 *                                     format flags                                     *
 *                                                                                      */
//========================================================================================

type FormatFlags = number

export const FORMAT_XPREFIX: FormatFlags = 0x1
export const FORMAT_PLUS: FormatFlags = 0x1
export const FORMAT_ZERO: FormatFlags = 0x2
export const FORMAT_SPACE: FormatFlags = 0x4
export const FORMAT_THOUSAND: FormatFlags = 0x8
export const FORMAT_LEFT: FormatFlags = 0x16

//──── flags parser ──────────────────────────────────────────────────────────────────────

const FLAG_MAPPING = {
	'#': FORMAT_XPREFIX,
	'+': FORMAT_PLUS,
	'0': FORMAT_ZERO,
	' ': FORMAT_SPACE,
	',': FORMAT_THOUSAND,
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
 *                                      Formatters                                      *
 *                                                                                      */
//========================================================================================

type FormatCallback = (
	val: any,
	flags: FormatFlags,
	width: number,
	precision: number | undefined,
	cutSuffix: string
) => string

type Formatter = {
	get: (obj: any, path: string[]) => any
	fmt: FormatCallback
}

const formatters: {
	[k: string]: Formatter
} = create(null)

export function extendFormatter(obj: { [key: string]: Formatter | FormatCallback }) {
	var fmt, name
	for (name in obj) {
		fmt = obj[name]
		if (isFn(fmt)) {
			formatters[name] = { fmt, get }
		} else if (isFn(fmt.fmt)) {
			formatters[name] = fmt
		}
	}
}

function getFormatter(name: string): Formatter {
	const f = formatters[name || 's']
	if (f) return f
	throw new Error(`Invalid Formatter: ${name}`)
}

function __doFormat(
	formatter: Formatter,
	val: any,
	flags: FormatFlags,
	width: number,
	fill: string,
	precision: number | undefined,
	cutSuffix: string
): string {
	let str = formatter.fmt(val, flags, width, precision, cutSuffix)
	if (width > str.length) str = pad(str, width, fill, flags & FORMAT_LEFT)
	return str
}

//========================================================================================
/*                                                                                      *
 *                           format by every parameter object                           *
 *                                                                                      */
//========================================================================================

/**
 * Syntax:
 * 			'{' (<parameter>)? ('!' <property>)? (':' (<flags>)? (<width>)? ('!' <property>)? ('=' <fill-char>)? ('.' <precision>  ('!' <property>)? )? )? (':'? <data-type>)? '}'
 * - parameter
 * 		- parameter index
 * 			{}						format by next unused argument
 * 			{<number>}				format by arguments[number]
 * 			{@}						format by current used argument
 * 			{$}						format by next unused argument
 * 		- property
 * 			{.<path>}				get value on parameter by property path
 * 									Syntax: '.' (<propName> | '[' (<number> | <string>) ']') ('.' <propName> | '[' (<number> | <string>) ']')*
 * 									eg. .abc.abc | .["abc"]['abc'] | .abc[0] | .[0].abc
 * - flags
 * 		space   prefix non-negative number with a space
 * 		+       prefix non-negative number with a plus sign
 * 		-       left-justify within the field
 * 		,		thousand separation number
 * 		#       ensure the leading "0" for any octal
 * 				prefix non-zero hexadecimal with "0x" or "0X"
 * 				prefix non-zero binary with "0b" or "0B"
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
 * 			(<width>)? ('=' <fill-char>)? ('.' <precision>)?
 * 		- min width
 * 		- precision width
 * - data-type
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
 * 			/[^\\{]+|											// escape
 * 			\\.|												// escape
 * 			(													// 1: expression
 * 				\{
 * 				(\d+|\$|@)?										// 2: parameter index
 * 				(?:!<property-path> )?							// 3: property path of parameter
 * 				(?:
 * 					:
 * 					([#,+\- ]*)									// 4: flags
 * 					(?:
 * 						(?:
 * 							(\d+)|								// 5: width
 * 							(?:
 * 								&
 * 								(\d+|\$|@)						// 6: parameter index of width
 * 								(?:!<property-path>)?			// 7: property path of width parameter
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
 * 								(?:!<property-path>)?			// 11: property path of width parameter
 * 							)
 * 						)
 * 					)?
 * 				)?
 * 				(?:
 * 					:?
 * 					([a-zA-Z_][a-zA-Z0-9_$]*))?					// 12: data type
 * 				\}
 * 			)/
 */
export function vformat<T>(fmt: string, args: T, offset?: number, getParam?: (args: T, idx: number) => any) {
	offset = offset || 0
	const state: [number, number] = [offset, offset]
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

		const formatter = getFormatter(type)

		return __doFormat(
			formatter,
			parseParam(param || '$', paramProp, state, args, getParam),
			parseFlags(flags),
			parseWidth(width, widx, wprop, state, args, getParam) || 0,
			fill || ' ',
			parseWidth(precision, pidx, pprop, state, args, getParam),
			cutSuffix || ''
		)
	})
}

function parseWidth<T>(
	width: string,
	idx: string | undefined,
	prop: string | undefined,
	state: [number, number],
	args: T,
	getParam: (args: T, idx: number) => any
): number | undefined {
	if (width) return (width as any) >> 0
	if (idx) {
		const w = parseParam(idx, prop, state, args, getParam) >> 0
		if (isFinite(w)) return w
	}
}

function parseParam<T>(
	paramIdx: string,
	prop: string | undefined,
	state: [number, number],
	args: T,
	getParam: (args: T, idx: number) => any
): any {
	let param = getParam(
		args,
		paramIdx === '$'
			? state[0]++
			: paramIdx === '@'
			? state[0] === state[1]
				? state[0]
				: state[0] - 1
			: (paramIdx as any) >> 0
	)
	if (prop) param = get(param, prop)
	return param
}

function defaultGetParam(args: any, idx: number) {
	return args[idx]
}

//========================================================================================
/*                                                                                      *
 *                                        format                                        *
 *                                                                                      */
//========================================================================================

function getFormatParam(args: IArguments, idx: number) {
	return args[idx + 1]
}

/**
 * @see vformat
 */
export function format(fmt: string, ...args: any): string
export function format(fmt: string): string {
	return vformat(fmt, arguments, 0, getFormatParam)
}

//========================================================================================
/*                                                                                      *
 *                                       formatter                                      *
 *                                                                                      */
//========================================================================================

const PROP1_VAR = 'p1',
	PROP2_VAR = 'p2',
	PROP3_VAR = 'p3',
	GET_PARAM_VAR = 'getp',
	GET_PROP_VAR = 'get',
	STATE_VAR = 'state'
function createFormatter(m: string[], getParam?: (args: IArguments, idx: number) => any) {
	const formatter = getFormatter(m[13])

	const p1 = m[3] && parsePath(m[3]),
		p2 = m[7] && parsePath(m[7]),
		p3 = m[11] && parsePath(m[11])

	return createFn(
		`return function(args, ${STATE_VAR}){
	return dofmt(fmt,
		${getParamCode(m[2] || '$', p1 && PROP1_VAR)},
		g,
		${getWidthCode(m[5], m[6], p2 && PROP2_VAR, '0')},
		f,
		${getWidthCode(m[9], m[10], p3 && PROP3_VAR, 'void 0')},
		cf);
}`,
		['dofmt', 'fmt', 'g', 'f', 'cf', GET_PROP_VAR, GET_PARAM_VAR, PROP1_VAR, PROP2_VAR, PROP3_VAR]
	)(__doFormat, formatter, parseFlags(m[4]), m[8] || ' ', m[12] || '', get, getParam, p1, p2, p3)
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
	if (prop) return `${GET_PROP_VAR}(${code}, ${prop})`
	return code
}

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
		if (append && arr[i - 1].length) {
			arr[i - 1] += str
		} else {
			codes[i] = `arr[${i}]`
			arr[i++] = str
		}
	}
}

//========================================================================================
/*                                                                                      *
 *                                  default formatters                                  *
 *                                                                                      */
//========================================================================================

const TOEXPONENTIAL = 'toExponential',
	TOPRECISION = 'toPrecision',
	TOFIXED = 'toFixed'

function floatFormatter(
	type: string
): (val: any, flags: FormatFlags, width: number, precision: number | undefined, cutSuffix: string) => string {
	const toStr =
			type === 'e' || type === 'E'
				? (num, precision) => num[TOEXPONENTIAL](precision)
				: type === 'f'
				? (num, precision) => precision >= 0 && num[TOFIXED](precision)
				: (num, precision) => precision && num[TOPRECISION](precision),
		upper = charCode(type) < 97

	return function(val, flags, width, precision) {
		let num = parseFloat(val)
		if (!isFinite(num)) return String(num)

		let str = toStr(num, precision) || String(num)

		if (flags & FORMAT_THOUSAND) {
			var split = str.split('.')
			split[0] = split[0].replace(thousandSeparationReg, '$1,')
			str = split.join('.')
		}
		str = prefixNum(num, str, flags, width)
		return upper ? str.toUpperCase() : str
	}
}

const BaseRadixs = {
	b: 2,
	B: 2,
	o: 8,
	u: 10,
	x: 16,
	X: 16
}
const BasePrefixs = ['0b', '0', '0x']
function baseFormatter(
	type: string
): (val: any, flags: FormatFlags, width: number, precision: number | undefined, cutSuffix: string) => string {
	const base = BaseRadixs[type],
		xprefix = base != 10 ? BasePrefixs[base >> 3] : '',
		upper = charCode(type) < 97
	return function(val, flags, width) {
		const num = val >>> 0
		if (!isFinite(num)) return String(num)
		const str = formatNum(num.toString(base), flags & FORMAT_XPREFIX ? xprefix : '', flags, width)
		return upper ? str.toUpperCase() : str
	}
}

function cutStr(str: string, len: number, suffix: string) {
	return len < str.length ? str.substr(0, len - suffix.length) + suffix : str
}
extendFormatter({
	s(val, flags, width, precision, cutSuffix) {
		return cutStr(String(val), precision, cutSuffix)
	},
	j(val, flags, width, precision, cutSuffix) {
		return cutStr(JSON.stringify(val), precision, cutSuffix)
	},
	c(val: any) {
		const num = val >> 0
		return num > 0 ? String.fromCharCode(num) : ''
	},
	d(val: any, flags, width) {
		let num = val >> 0
		if (!isFinite(num)) return String(num)

		let str = String(num)

		if (flags & FORMAT_THOUSAND) str = str.replace(thousandSeparationReg, '$1,')

		return prefixNum(num, str, flags, width)
	},
	e: floatFormatter('e'),
	E: floatFormatter('E'),
	f: floatFormatter('f'),
	g: floatFormatter('g'),
	G: floatFormatter('G'),
	b: baseFormatter('b'),
	B: baseFormatter('B'),
	o: baseFormatter('o'),
	u: baseFormatter('u'),
	x: baseFormatter('x'),
	X: baseFormatter('X')
})

function prefixNum(num: number, str: string, flags: FormatFlags, width: number) {
	return formatNum(str, num < 0 ? '' : flags & FORMAT_PLUS ? '+' : flags & FORMAT_SPACE ? ' ' : '', flags, width)
}

function formatNum(str: string, prefix: string, flags: FormatFlags, width: number) {
	if (flags & FORMAT_ZERO && width > str.length - prefix.length) {
		str = pad(str, width - prefix.length, '0')
	}
	return prefix + str
}
