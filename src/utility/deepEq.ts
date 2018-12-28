import { eq, isReg, isTypedArray, isDate, isArray, isPrimitive } from './is'
import { hasOwnProp } from './prop'
import { create } from './create'
import { getConstructor } from './constructor'

const REG_PROPS = ['source', 'global', 'ignoreCase', 'multiline']

export function deepEq(actual: any, expected: any): boolean {
	if (eq(actual, expected)) return true
	if (actual && expected && getConstructor(actual) === getConstructor(expected)) {
		if (isPrimitive(actual)) return String(actual) === String(expected)
		if (isDate(actual)) return actual.getTime() === expected.getTime()
		if (isReg(actual)) return eqProps(actual, expected, REG_PROPS)
		if (isArray(actual)) return eqArray(actual, expected, deepEq)
		if (isTypedArray(actual)) return eqArray(actual, expected, eq)
		return eqObj(actual, expected)
	}
	return false
}

function eqProps(actual: any, expected: any, props: string[]): boolean {
	let i = props.length
	while (i--)
		if (actual[props[i]] !== expected[props[i]]) {
			return false
		}
	return true
}

function eqArray(actual: any, expected: any, eq: (actual: any, expected: any) => boolean) {
	let i = actual.length
	if (i !== expected.length) {
		return false
	}
	while (i--)
		if (!eq(actual[i], expected[i])) {
			return false
		}
	return true
}

function eqObj(actual: any, expected: any): boolean {
	const cache = create(null)
	let k: string
	for (k in actual) {
		if (notEqObjKey(actual, expected, k)) {
			return false
		}
		cache[k] = true
	}
	for (k in expected) {
		if (!cache[k] && notEqObjKey(actual, expected, k)) {
			return false
		}
	}
	return true
}

function notEqObjKey(actual: any, expected: any, k: string): boolean {
	return hasOwnProp(actual, k) ? !hasOwnProp(expected, k) || !deepEq(actual[k], expected[k]) : hasOwnProp(expected, k)
}
