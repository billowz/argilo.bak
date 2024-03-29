/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Wed Apr 10 2019 11:19:57 GMT+0800 (China Standard Time)
 */
import { eq, isReg, isTypedArray, isDate, isArray, isPrimitive } from './is'
import { hasOwnProp } from './ownProp'
import { create } from './create'
import { getCtor } from './ctor'
import { DKeyMap } from './dkeys'

const REG_PROPS = ['source', 'global', 'ignoreCase', 'multiline']

export function deepEq(actual: any, expected: any): boolean {
	return doDeepEq(actual, expected, eq, doDeepEqObj)
}

export function doDeepEq(
	actual: any,
	expected: any,
	eq: (actual: any, expected: any) => boolean,
	eqObj: (actual: any, expected: any) => boolean
) {
	if (eq(actual, expected)) return true
	if (actual && expected && getCtor(actual) === getCtor(expected)) {
		if (isPrimitive(actual)) return String(actual) === String(expected)
		if (isDate(actual)) return actual.getTime() === expected.getTime()
		if (isReg(actual)) return eqProps(actual, expected, REG_PROPS)
		if (isArray(actual)) return eqArray(actual, expected, eq, eqObj)
		if (isTypedArray(actual)) return eqTypeArray(actual, expected)
		return eqObj(actual, expected)
	}
	return false
}

export function doDeepEqObj(actual: any, expected: any): boolean {
	const cache = create(null)
	let k: string
	for (k in actual) {
		if (!DKeyMap[k] && (!(k in expected) || !deepEq(actual[k], expected[k]))) {
			return false
		}
		cache[k] = true
	}
	for (k in expected) {
		if (!cache[k] && !DKeyMap[k] && (!(k in actual) || !deepEq(actual[k], expected[k]))) {
			return false
		}
	}
	return true
}

function eqProps(actual: any, expected: any, props: string[]): boolean {
	let i = props.length
	while (i--)
		if (actual[props[i]] !== expected[props[i]]) {
			return false
		}
	return true
}

function eqTypeArray(actual: any, expected: any) {
	let i = actual.length
	if (i !== expected.length) {
		return false
	}
	while (i--)
		if (actual[i] !== expected[i]) {
			return false
		}
	return true
}

function eqArray(
	actual: any,
	expected: any,
	eq: (actual: any, expected: any) => boolean,
	eqObj: (actual: any, expected: any) => boolean
) {
	let i = actual.length
	if (i !== expected.length) {
		return false
	}
	while (i--)
		if (!doDeepEq(actual[i], expected[i], eq, eqObj)) {
			return false
		}
	return true
}
