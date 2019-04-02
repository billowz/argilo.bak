/**
 * @module utility/assert
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Nov 28 2018 11:01:45 GMT+0800 (China Standard Time)
 * @modified Tue Apr 02 2019 19:30:29 GMT+0800 (China Standard Time)
 */

import {
	eq,
	isBool,
	isNum,
	isStr,
	isBoolean,
	isNumber,
	isString,
	isDate,
	isNull,
	isUndef,
	isNil,
	isFn,
	isInt,
	isPrimitive,
	isReg,
	isArray,
	isArrayLike,
	isTypedArray,
	isObj,
	isBlank
} from '../utility/is'
import { create } from './create'
import { upperFirst, escapeStr } from '../utility/string'
import { createFn, applyScope } from '../utility/fn'
import { eachObj, makeArray } from '../utility/collection'
import { formatter } from './format'
import { deepEq } from './deepEq'
import { TYPE_UNDEF, TYPE_FN, TYPE_STRING, TYPE_NUM, TYPE_BOOL } from './consts'

export interface assert {
	(msg?: string, ...args: any[]): never
	is(actual: any, msg?: string, ...args: any[]): assert
	not(actual: any, msg?: string, ...args: any[]): assert

	eq(actual: any, expect: any, msg?: string, ...args: any[]): assert
	notEq(actual: any, expect: any, msg?: string, ...args: any[]): assert

	eql(actual: any, expect: any, msg?: string, ...args: any[]): assert
	notEql(actual: any, expect: any, msg?: string, ...args: any[]): assert

	blank(actual: any, msg?: string, ...args: any[]): assert
	notBlank(actual: any, msg?: string, ...args: any[]): assert

	nul(actual: any, msg?: string, ...args: any[]): assert
	notNul(actual: any, msg?: string, ...args: any[]): assert

	nil(actual: any, msg?: string, ...args: any[]): assert
	notNil(actual: any, msg?: string, ...args: any[]): assert

	undef(actual: any, msg?: string, ...args: any[]): assert
	notUndef(actual: any, msg?: string, ...args: any[]): assert

	bool(actual: any, msg?: string, ...args: any[]): assert
	notBool(actual: any, msg?: string, ...args: any[]): assert

	num(actual: any, msg?: string, ...args: any[]): assert
	notNum(actual: any, msg?: string, ...args: any[]): assert

	int(actual: any, msg?: string, ...args: any[]): assert
	notInt(actual: any, msg?: string, ...args: any[]): assert

	str(actual: any, msg?: string, ...args: any[]): assert
	notStr(actual: any, msg?: string, ...args: any[]): assert

	fn(actual: any, msg?: string, ...args: any[]): assert
	notFn(actual: any, msg?: string, ...args: any[]): assert

	primitive(actual: any, msg?: string, ...args: any[]): assert
	notPrimitive(actual: any, msg?: string, ...args: any[]): assert

	boolean(actual: any, msg?: string, ...args: any[]): assert
	notBoolean(actual: any, msg?: string, ...args: any[]): assert

	number(actual: any, msg?: string, ...args: any[]): assert
	notNumber(actual: any, msg?: string, ...args: any[]): assert

	string(actual: any, msg?: string, ...args: any[]): assert
	notString(actual: any, msg?: string, ...args: any[]): assert

	date(actual: any, msg?: string, ...args: any[]): assert
	notDate(actual: any, msg?: string, ...args: any[]): assert

	reg(actual: any, msg?: string, ...args: any[]): assert
	notReg(actual: any, msg?: string, ...args: any[]): assert

	array(actual: any, msg?: string, ...args: any[]): assert
	notArray(actual: any, msg?: string, ...args: any[]): assert

	typedArray(actual: any, msg?: string, ...args: any[]): assert
	notTypedArray(actual: any, msg?: string, ...args: any[]): assert

	arrayLike(actual: any, msg?: string, ...args: any[]): assert
	notArrayLike(actual: any, msg?: string, ...args: any[]): assert

	obj(actual: any, msg?: string, ...args: any[]): assert
	notObj(actual: any, msg?: string, ...args: any[]): assert

	nan(actual: any, msg?: string, ...args: any[]): assert
	notNan(actual: any, msg?: string, ...args: any[]): assert

	finite(actual: number | string, msg?: string, ...args: any[]): assert
	notFinite(actual: any, msg?: string, ...args: any[]): assert

	less(actual: number, expect: number, msg?: string, ...args: any[]): assert
	notLess(actual: number, expect: number, msg?: string, ...args: any[]): assert

	greater(actual: number, expect: number, msg?: string, ...args: any[]): assert
	notGreater(actual: number, expect: number, msg?: string, ...args: any[]): assert

	match(actual: string, expect: any, msg?: string, ...args: any[]): assert
	notMatch(actual: string, expect: any, msg?: string, ...args: any[]): assert

	range(actual: number, start: number, end: number, msg?: string, ...args: any[]): assert
	notRange(actual: number, start: number, end: number, msg?: string, ...args: any[]): assert

	throw(fn: () => any, err?: Error | string, msg?: string, ...args: any[]): assert
	notThrow(fn: () => any, err?: Error | string, msg?: string, ...args: any[]): assert

	executor<T extends (...args: any[]) => any>(fn: T, maxCall: number, msg?: string): T & { called: number }
}

const formatters = [],
	formatArgHandlers: ((args: any[] | IArguments, offset: number) => any)[] = []
function mkError(Err: { new (message?: string): Error }, msg: string, args: any[] | IArguments, msgIdx: number): Error {
	let fs = formatters[msgIdx]
	if (!fs) {
		formatArgHandlers[msgIdx] = (args, offset) => args[0][offset >= msgIdx ? offset + 1 : offset]
		formatters[msgIdx] = fs = create(null)
	}
	const fmtter = fs[msg] || (fs[msg] = formatter(msg, msgIdx, formatArgHandlers[msgIdx]))
	return popErrStack(new Err(fmtter(args)), 2)
}

export function popErrStack(err: Error, i: number): Error {
	while (i-- > 0) {
		err.stack = err.stack.replace(/(\n\s{4}at[^\n]*)/, '')
	}
	return err
}

export const assert = function assert(msg?: string): never {
	throw mkError(Error, msg || 'Error', arguments, 0)
} as assert

function catchErr(fn: () => any): Error {
	try {
		fn()
	} catch (e) {
		return e
	}
}

function checkErr(expect: Error | string, err: Error): boolean {
	let msg = isStr(expect) ? (expect as string) : (expect as Error).message
	return msg === err.message
}
const ERROR = new Error(`Expect Error`)
const throwMsg = mkMsg(objFormatter(1), 'throw')

assert.throw = function(fn: () => any, expect: Error | string, msg?: string): assert {
	const err = catchErr(fn)
	if (!err || (expect && !checkErr(expect, err))) {
		arguments[0] = err
		!expect && (arguments[2] = ERROR)
		throw mkError(Error, msg || throwMsg[0], arguments, 2)
	}
	return assert
}

assert.notThrow = function(fn: () => any, expect: Error | string, msg?: string): assert {
	const err = catchErr(fn)
	if (err && (!expect || !checkErr(expect, err))) {
		arguments[0] = err
		!expect && (arguments[2] = ERROR)
		throw mkError(Error, msg || throwMsg[0], arguments, 2)
	}
	return assert
}

function extendAssert<T extends Function>(
	name: string,
	condition: string | ((...args: any) => boolean) | [string | ((...args: any) => boolean), string?],
	args: string | number | string[],
	dmsg: string,
	Err?: { new (message?: string): Error }
): T {
	const params: string[] = isStr(args)
			? (args as string).split(/,/g)
			: isNum(args)
			? makeArray(args as number, i => `arg${i + 1}`)
			: (args as string[]),
		paramStr = params.join(', '),
		cond = isArray(condition) ? condition[0] : condition,
		expr = (isArray(condition) ? condition[1] : '') + (isStr(cond) ? `(${cond})` : `cond(${paramStr})`)

	return (assert[name] = createFn(
		`return function assert${upperFirst(name)}(${paramStr}, msg){
	if (${expr})
		throw mkErr(Err, msg || dmsg, arguments, ${params.length});
	return assert;
}`,
		['Err', 'mkErr', 'dmsg', 'cond', 'assert']
	)(Err || Error, mkError, dmsg, cond, assert))
}

type APIDescriptor = [
	string | ((...args: any) => boolean), // condition
	string | number | string[], // arguments
	[string, string], // expect or [err msg, not err msg]
	({ new (message?: string): Error })?
]

// [condition, argcount?, [msg, not msg], Error]
function extendAsserts(apis: { [method: string]: APIDescriptor }) {
	eachObj(apis, (desc: APIDescriptor, name) => {
		const condition = desc[0],
			args = desc[1],
			msg = desc[2],
			Err = desc[3] || TypeError

		msg[0] && extendAssert(name, [condition, '!'], args, msg[0], Err)
		msg[1] && extendAssert('not' + upperFirst(name), condition, args, msg[1], Err)
	})
}

const UNDEFINED = TYPE_UNDEF,
	BOOLEAN = TYPE_BOOL,
	NUMBER = TYPE_NUM,
	STRING = TYPE_STRING,
	FUNCTION = TYPE_FN,
	NULL = 'null',
	INTEGER = 'integer',
	ARRAY = 'Array',
	TYPED_ARRAY = 'TypedArray'

extendAssert('is', '!o', 'o', expectMsg('Exist'))
extendAssert('not', 'o', 'o', expectMsg('Not Exist'))
extendAsserts({
	eq: [eq, 2, mkMsg(objFormatter(1))],
	eql: [deepEq, 2, mkMsg(objFormatter(1))],
	nul: [isNull, 1, mkMsg(NULL)],
	nil: [isNil, 1, mkMsg(typeExpect(NULL, UNDEFINED))],
	undef: [isUndef, 1, mkMsg(UNDEFINED)],
	bool: [isBool, 1, mkMsg(BOOLEAN)],
	num: [isNum, 1, mkMsg(NUMBER)],
	int: [isInt, 1, mkMsg(INTEGER)],
	str: [isStr, 1, mkMsg(STRING)],
	fn: [isFn, 1, mkMsg(FUNCTION)],
	primitive: [
		isPrimitive,
		1,
		mkMsg(`Primitive type(${typeExpect(NULL, UNDEFINED, BOOLEAN, NUMBER, INTEGER, STRING, FUNCTION)})`)
	],
	boolean: [isBoolean, 1, mkMsg(packTypeExpect(BOOLEAN))],
	number: [isNumber, 1, mkMsg(packTypeExpect(NUMBER))],
	string: [isString, 1, mkMsg(packTypeExpect(STRING))],
	date: [isDate, 1, mkMsg('Date')],
	reg: [isReg, 1, mkMsg('RegExp')],
	array: [isArray, 1, mkMsg(ARRAY)],
	typedArray: [isTypedArray, 1, mkMsg('TypedArray')],
	arrayLike: [
		isArrayLike,
		1,
		mkMsg(typeExpect(ARRAY, packTypeExpect(STRING), 'Arguments', TYPED_ARRAY, 'NodeList', 'HTMLCollection'))
	],
	obj: [isObj, 1, mkMsg('Object')],
	nan: [isNaN, 1, mkMsg('NaN')],
	finite: [isFinite, 1, mkMsg('Finite')],
	blank: [isBlank, 1, mkMsg('Blank')],
	less: ['o<t', 'o,t', mkMsg(objFormatter(1), 'less than')],
	greater: ['o>t', 'o,t', mkMsg(objFormatter(1), 'greater than')],
	match: ['reg.test(str)', 'str,reg', mkMsg(objFormatter(1), 'match')],
	range: ['o>=s&&o<e', 'o,s,e', mkMsg(`[{1} - {2})`)]
})

function mkMsg(expect: string, to?: string): [string, string] {
	return [expectMsg(expect, false, to), expectMsg(expect, true, to)]
}
function expectMsg(expect: string, not?: boolean, to?: string): string {
	return `Expected ${objFormatter(0)} ${not ? 'not ' : ''}${to || 'to'} ${expect}`
}

function objFormatter(idx: number): string {
	return `{${idx}:.80="..."j}`
}

function packTypeExpect(base: string, all?: boolean): string {
	return all ? typeExpect(base, upperFirst(base)) : upperFirst(base)
}
function typeExpect(...types: string[]): string
function typeExpect(): string {
	return Array.prototype.join.call(arguments, ' | ')
}
