import { eq, isReg, isTypedArray, isFn } from './is'
import { isDate, isArray } from 'util'
import { hasOwnProp } from './prop'
import { create } from './create'
import { CONSTRUCTOR } from './consts'

export function deepEq(actual, expected) {
	if (eq(actual, expected)) return true
	if (actual && expected) {
		if (isDate(actual)) return isDate(expected) && actual.getTime() === expected.getTime()
		if (isReg(actual))
			return isReg(expected) && eqProps(actual, expected, ['source', 'global', 'ignoreCase', 'multiline'])
		if (isArray(actual)) return isArray(expected) && eqArray(actual, expected, deepEq)
		if (isTypedArray(actual)) return isTypedArray(expected) && eqArray(actual, expected, eq)
		if (getConstructor(actual) === getConstructor(expected)) return eqObj(actual, expected)
	}
	return false
}

function getConstructor(o) {
	let C = o[CONSTRUCTOR]
	return isFn(C) ? C : Object
}

function eqProps(actual, expected, props) {
	let i = props.length
	while (i--) if (actual[props[i]] !== expected[props[i]]) return false
	return true
}

function eqArray(actual, expected, eq) {
	let i = actual.length
	if (i !== expected.length) return false
	while (i--) if (!eq(actual[i], expected[i])) return false
	return true
}

function eqObj(actual, expected) {
	const cache = create(null)
	let k
	for (k in actual) {
		if (notEqObjKey(actual, expected, k)) return false
		cache[k] = true
	}
	for (k in expected) {
		if (!cache[k] && notEqObjKey(actual, expected, k)) return false
	}
	return true
}

function notEqObjKey(actual, expected, k) {
	return hasOwnProp(actual, k) ? !hasOwnProp(expected, k) || !deepEq(actual[k], expected[k]) : hasOwnProp(expected, k)
}
