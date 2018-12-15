/**
 *
 * @module common/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:58:52 GMT+0800 (China Standard Time)
 * @modified Sat Dec 15 2018 20:36:03 GMT+0800 (China Standard Time)
 */
export * from './Rule'
export * from './MatchRule'
export * from './CharMatchRule'
export * from './RegMatchRule'
export * from './StringMatchRule'
export * from './ComplexRule'
export * from './AndRule'
export * from './OrRule'

import { ruleBuilder } from './ComplexRule'
import { isObj, isReg, isStr, isBool, isNum, isInt, isArray, isArrayLike, isFn } from '../is'
import { makeMap, mapArray, SKIP } from '../collection'
import { CharMatchRule } from './CharMatchRule'
import { StringMatchRule } from './StringMatchRule'
import { RegMatchRule } from './RegMatchRule'
import { onMatchCallback, onErrorCallback, Rule } from './Rule'
import { MatchRule } from './MatchRule'
import { AndRule } from './AndRule'
import { OrRule } from './OrRule'
import { assert } from '../assert'

//========================================================================================
/*                                                                                      *
 *                                  match rule builder                                  *
 *                                                                                      */
//========================================================================================

//──── named regexp match api ────────────────────────────────────────────────────────────
export function match(
	name: string,
	pattern: RegExp,
	pick?: boolean | number,
	startCodes?: number | string | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(
	name: string,
	pattern: RegExp,
	startCodes?: number | string | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(
	name: string,
	pattern: RegExp,
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(name: string, pattern: RegExp, onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule

//──── regexp match api ──────────────────────────────────────────────────────────────────
export function match(
	pattern: RegExp,
	pick?: boolean | number,
	startCodes?: number | string | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(
	pattern: RegExp,
	startCodes?: number | string | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(
	pattern: RegExp,
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(pattern: RegExp, onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule

//──── named string match api ────────────────────────────────────────────────────────────
export function match(
	name: string,
	pattern: number | string | any[],
	ignoreCase?: boolean,
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule

export function match(
	name: string,
	pattern: number | string | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule

export function match(
	name: string,
	pattern: number | string | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule

//──── string match api ──────────────────────────────────────────────────────────────────
export function match(
	pattern: number | string | any[],
	ignoreCase?: boolean,
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule

export function match(
	pattern: number | string | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule

export function match(pattern: number | string | any[], onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule

export function match(desc: MatchRuleDescriptor): MatchRule

export function match(o): MatchRule {
	return mkMatch(isObj(o) ? o : arguments)
}

type MatchRuleDescriptor = {
	name: string
	pattern: RegExp | number | string | any[]
	pick: boolean | number
	startCodes: number | string | any[]
	ignoreCase: boolean
	capturable: boolean
	onMatch: onMatchCallback
	onErr: onErrorCallback
}
function mkMatch(args: IArguments | any[] | MatchRuleDescriptor): MatchRule {
	let name: string,
		pattern: number | string | any[],
		regexp: RegExp,
		pick: boolean | number = 0,
		startCodes: number | string | any[],
		ignoreCase: boolean = false,
		capturable: boolean,
		onMatch: onMatchCallback,
		onErr: onErrorCallback
	if (isArrayLike(args)) {
		var i = 2

		if (isMatchPattern(args[1])) {
			name = args[0]
			isReg(args[1]) ? (regexp = args[1]) : (pattern = args[1])
		} else if (isMatchPattern(args[0])) {
			i = 1
			isReg(args[0]) ? (regexp = args[0]) : (pattern = args[0])
		}

		if (regexp) {
			if (isBool(args[i]) || isInt(args[i])) pick = args[i++]
			if (isStrOrCodes(pattern)) startCodes = args[i++]
		} else {
			if (isBool(args[i])) ignoreCase = args[i++]
		}
		if (isBool(args[i])) capturable = args[i++]
		onMatch = args[i++]
		onErr = args[i++]
	} else if (isObj(args)) {
		const desc = args as MatchRuleDescriptor,
			p = desc.pattern
		if (isReg(p)) {
			regexp = p as RegExp
			pick = desc.pick
			startCodes = desc.startCodes
		} else if (isMatchPattern(p)) {
			pattern = p as number | string | any[]
			ignoreCase = desc.ignoreCase
		}
		name = desc.name
		capturable = desc.capturable
		onMatch = desc.onMatch
		onErr = desc.onErr
	}

	return regexp
		? regMatch(name, regexp, pick, startCodes, capturable, onMatch, onErr)
		: pattern
		? strMatch(name, pattern, ignoreCase, capturable, onMatch, onErr)
		: null
}

function isStrOrCodes(pattern): boolean {
	return isStr(pattern) || isNum(pattern) || isArray(pattern)
}
function isMatchPattern(pattern): boolean {
	return isReg(pattern) || isStrOrCodes(pattern)
}

function strMatch(
	name: string,
	pattern: string | number | any[],
	ignoreCase: boolean,
	capturable: boolean,
	onMatch: onMatchCallback,
	onErr: onErrorCallback
) {
	const C = isStr(pattern) && (pattern as string).length <= 1 ? StringMatchRule : CharMatchRule
	return new C(name, pattern, ignoreCase, capturable, onMatch, onErr)
}

const REG_ESPEC_CHARS = makeMap('dDsStrnt0cbBfvwW', 1, '')

function regMatch(
	name: string,
	pattern: RegExp,
	pick: boolean | number,
	startCodes: number | string | any[],
	capturable: boolean,
	onMatch: onMatchCallback,
	onErr: onErrorCallback
) {
	const source = pattern.source
	if (!pick) {
		var c: string | 0 = 0
		if (source.length == 1 && source !== '^' && source !== '$') {
			c = source === '.' ? '' : source
		} else if (source.length == 2 && source[0] === '\\' && REG_ESPEC_CHARS[source[1]]) {
			c = source[1]
		}
		if (c != 0) return strMatch(name, c as string, pattern.ignoreCase, capturable, onMatch, onErr)
	}
	return new RegMatchRule(name, pattern, pick, startCodes, capturable, onMatch, onErr)
}
//========================================================================================
/*                                                                                      *
 *                                   and rule builder                                   *
 *                                                                                      */
//========================================================================================

export function and(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	repeat?: [number, number],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function and(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function and(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule

export function and(
	rules: ((rule: Rule) => any[]) | any[],
	repeat?: [number, number],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function and(
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function and(rules: ((rule: Rule) => any[]) | any[], onMatch?: onMatchCallback, onErr?: onErrorCallback): AndRule
export function and(desc: ComplexRuleDescriptor): AndRule

export function and(o): AndRule {
	return mkComplexRule(arguments, AndRule, [1, 1])
}

export function any(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function any(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule

export function any(
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function any(rules: ((rule: Rule) => any[]) | any[], onMatch?: onMatchCallback, onErr?: onErrorCallback): AndRule
export function any(desc: ComplexRuleDescriptor): AndRule
export function any(o): AndRule {
	return mkComplexRule(arguments, AndRule, [1, -1])
}

export function many(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function many(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule

export function many(
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function many(
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function many(desc: ComplexRuleDescriptor): AndRule
export function many(o): AndRule {
	return mkComplexRule(arguments, AndRule, [0, -1])
}

export function option(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function option(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule

export function option(
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function option(
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function option(desc: ComplexRuleDescriptor): AndRule
export function option(o): AndRule {
	return mkComplexRule(arguments, AndRule, [0, 1])
}

//========================================================================================
/*                                                                                      *
 *                                   OR Rule Builders                                   *
 *                                                                                      */
//========================================================================================

export function or(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	repeat?: [number, number],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function or(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function or(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule

export function or(
	rules: ((rule: Rule) => any[]) | any[],
	repeat?: [number, number],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function or(
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function or(rules: ((rule: Rule) => any[]) | any[], onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule
export function or(desc: ComplexRuleDescriptor): OrRule

export function or(o): OrRule {
	return mkComplexRule(arguments, OrRule, [1, 1])
}

export function anyOne(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function anyOne(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule

export function anyOne(
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function anyOne(
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function anyOne(desc: ComplexRuleDescriptor): OrRule
export function anyOne(o): OrRule {
	return mkComplexRule(arguments, OrRule, [1, -1])
}

export function manyOne(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function manyOne(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule

export function manyOne(
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function manyOne(
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function manyOne(desc: ComplexRuleDescriptor): OrRule
export function manyOne(o): OrRule {
	return mkComplexRule(arguments, OrRule, [0, -1])
}

export function optionOne(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function optionOne(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule

export function optionOne(
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function optionOne(
	rules: ((rule: Rule) => any[]) | any[],
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function optionOne(desc: ComplexRuleDescriptor): OrRule
export function optionOne(o): OrRule {
	return mkComplexRule(arguments, OrRule, [0, 1])
}

//========================================================================================
/*                                                                                      *
 *                                 complex rule builder                                 *
 *                                                                                      */
//========================================================================================

type ComplexRuleDescriptor = {
	name: string
	rules: ((rule: Rule) => any[]) | any[]
	repeat: [number, number]
	capturable: boolean
	onMatch: onMatchCallback
	onErr: onErrorCallback
}
function mkComplexRule<T extends AndRule | OrRule>(
	args: IArguments,
	Rule: typeof AndRule | typeof OrRule,
	defaultRepeat: [number, number]
): T {
	let name: string,
		builder: ruleBuilder,
		rules: ((rule: Rule) => any[]) | any[],
		repeat: [number, number],
		capturable: boolean,
		onMatch: onMatchCallback,
		onErr: onErrorCallback
	if (isObj(args[0])) {
		const desc = args[0] as ComplexRuleDescriptor,
			r = desc.rules
		if (isArray(r) || isFn(r)) rules = r
		repeat = desc.repeat
		name = desc.name
		capturable = desc.capturable
		onMatch = desc.onMatch
		onErr = desc.onErr
	} else if (isArrayLike(args)) {
		var i = 0
		if (isStr(args[i])) name = args[i++]
		if (isArray(args[i]) || isFn(args[i])) rules = args[i++]
		if (isArray(args[i])) repeat = args[i++]

		if (isBool(args[i])) capturable = args[i++]
		onMatch = args[i++]
		onErr = args[i++]
	}
	if (!repeat) repeat = defaultRepeat
	if (rules) {
		builder = rulesBuilder(rules)
	}

	if (builder) if (isBool(args[i])) capturable = args[i++]
	return new Rule(name, repeat, builder, capturable, onMatch, onErr) as T
}

function rulesBuilder(rules: ((rule: Rule) => any[]) | any[]): (rule: Rule) => Rule[] {
	return function(rule) {
		return mapArray(isFn(rules) ? (rules as ((rule: Rule) => any[]))(rule) : rules, (r, i) => {
			if (!r) return SKIP
			let rule: Rule = isArray(r) || isObj(r) ? mkMatch(r) : r.$rule ? r : null
			assert.is(rule, 'Invalid Rule Configuration on index {d}: {:.20="..."j}', i, r)
			return rule
		})
	}
}
