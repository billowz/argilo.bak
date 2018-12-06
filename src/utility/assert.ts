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
import { upperFirst } from '../utility/string'
import { createFn, applyNoScopeN } from '../utility/fn'
import { eachObj, makeArray, arr2obj } from '../utility/collection'

type MessageProvider = string | ((...extraArgs: any[]) => string)

function toString(o: any): string {
	return Object.prototype.toString.call(o)
}

function parseMessage(
	msg: MessageProvider,
	args: IArguments,
	offset: number,
	namedMap?: { [key: string]: number }
): string {
	if (isStr(msg)) {
		// TODO change to utility/string.format
		var index = offset
		return (msg as string).replace(/(%s)|()/g, () => {
			return toString(args[index++])
		})
	} else if (isFn(msg)) {
		return applyNoScopeN(msg as any, args, offset, args.length - offset)
	}
	return toString(msg)
}

interface assert {}

export function assert(msg: MessageProvider, ...args: any[]): void
export function assert(msg: any): void {
	throw new Error(parseMessage(msg, arguments, 2))
}

function extendAPI<T extends Function>(
	name: string,
	args: string[],
	condition: [string | ((...args: any) => boolean), string?],
	dmsg: MessageProvider,
	Err?: typeof Error | typeof TypeError | typeof SyntaxError
): T {
	const argStr = args.join(', '),
		namedMap = arr2obj(args, (name, i) => [name, i])

	let expr, checker
	if (isStr(condition[0])) {
		expr = `${condition[1] || ''}(${condition[0]})`
	} else {
		checker = condition[0]
		expr = `${condition[1] || ''}checker(${argStr})`
	}
	return (assert[name] = createFn(
		`return function ${name}(${argStr}, msg){
	if (${expr})
		throw new Err(parseMsg(msg || dmsg, arguments, ${args.length}, namedMap));
	return assert;
}`,
		['Err', 'parseMsg', 'dmsg', 'namedMap', 'checker']
	)(Err || Error, parseMessage, dmsg, namedMap, checker))
}

// [checker, argcount?, [msg, not msg], Error]
function extendAPIs(apis: {
	[method: string]: [
		string | ((...args: any) => boolean), // checker
		string | number | string[], // arguments
		string | [MessageProvider?, MessageProvider?], // expect or [err msg, not err msg]
		(typeof Error | typeof TypeError | typeof SyntaxError)?
	]
}) {
	eachObj(apis, (desc, name) => {
		const checker = desc[0],
			args = desc[1],
			msg = desc[2],
			Err = desc[3] || TypeError

		const params: string[] = isStr(args)
			? (args as string).split(/,/g)
			: isNum(args)
			? makeArray(args as number, i => `arg${i + 1}`)
			: (args as string[])
		const errMsg = isStr(msg) ? [] : msg

		errMsg[0] && extendAPI(name, params, [checker, '!'], errMsg[0], Err)
		errMsg[1] && extendAPI(name, params, [checker], errMsg[1], Err || TypeError)
	})
}
function genDefaultMsg(type, not) {
	const s = `${not} to ${type}`
	return function(args) {
		return `Expected ${toString(args[0])} ${s}`
	}
}

const NULL = 'null'
const UNDEFINED = 'undefined'
const BOOLEAN = 'boolean'
const NUMBER = 'number'
const INTEGER = 'integer'
const STRING = 'string'
const FUNCTION = 'function'
const ARRAY = 'Array'
const TYPED_ARRAY = 'TypedArray'

const ACTUAL = 'actual',
	EXPECT = 'expect'
/*
extendAPIs({
	if: [ACTUAL, ACTUAL, ['Exist']],
	not: [ACTUAL, ACTUAL, [, 'Not Exist']],
	blank: [isBlank, ACTUAL, 'Blank'],
	eq: [eq, [ACTUAL, EXPECT], []],
	nul: [isNull, ACTUAL, NULL],
	nil: [isNil, ACTUAL, typeExpect(NULL, UNDEFINED)],
	undef: [isUndef, ACTUAL, UNDEFINED],
	bool: [isBool, ACTUAL, BOOLEAN],
	num: [isNum, ACTUAL, NUMBER],
	int: [isInt, ACTUAL, INTEGER],
	str: [isStr, ACTUAL, STRING],
	fn: [isFn, ACTUAL, FUNCTION],
	primitive: [
		isPrimitive,
		ACTUAL,
		`Primitive type(${typeExpect(NULL, UNDEFINED, BOOLEAN, NUMBER, INTEGER, STRING, FUNCTION)})`
	],
	boolean: [isBoolean, ACTUAL, packTypeExpect(BOOLEAN)],
	number: [isNumber, ACTUAL, packTypeExpect(NUMBER)],
	string: [isString, ACTUAL, packTypeExpect(STRING)],
	date: [isDate, ACTUAL, 'Date'],
	reg: [isReg, ACTUAL, 'RegExp'],
	array: [isArray, ACTUAL, ARRAY],
	typedArray: [isTypedArray, ACTUAL, 'TypedArray'],
	arrayLike: [
		isArrayLike,
		ACTUAL,
		typeExpect(ARRAY, packTypeExpect(STRING), 'Arguments', TYPED_ARRAY, 'NodeList', 'HTMLCollection')
	],
	obj: [isObj, ACTUAL, 'Object'],
	nan: [isNaN, ACTUAL, 'NaN'],
	finite: [isFinite, ACTUAL, 'Finite']
})
 */
function packTypeExpect(base: string, all?: boolean): string {
	return all ? typeExpect(base, upperFirst(base)) : upperFirst(base)
}

function typeExpect(...types: string[]): string
function typeExpect(): string {
	return Array.prototype.join.call(arguments, ' | ')
}
