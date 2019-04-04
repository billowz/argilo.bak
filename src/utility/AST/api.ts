/**
 * AST Parser API
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:58:52 GMT+0800 (China Standard Time)
 * @modified Thu Apr 04 2019 19:59:23 GMT+0800 (China Standard Time)
 */

import { ComplexRuleBuilder } from './ComplexRule'
import { isObj, isReg, isStr, isBool, isNum, isInt, isArray, isArrayLike, isFn } from '../is'
import { makeMap, mapArray, SKIP } from '../collection'
import { CharMatchRule } from './CharMatchRule'
import { StringMatchRule } from './StringMatchRule'
import { RegMatchRule } from './RegMatchRule'
import { onMatchCallback, onErrorCallback, Rule, MatchError, RuleOptions } from './Rule'
import { MatchRule } from './MatchRule'
import { AndRule } from './AndRule'
import { OrRule } from './OrRule'
import { assert } from '../assert'
import { MatchContext } from './MatchContext'
import { EMPTY_FN } from '../consts'

//========================================================================================
/*                                                                                      *
 *                                      match tools                                     *
 *                                                                                      */
//========================================================================================

export const discardMatch: onMatchCallback = EMPTY_FN

export function appendMatch(data: any, len: number, context: MatchContext) {
	context.addAll(data)
}
export function attachMatch(
	callback: (data: any, len: number, context: MatchContext, rule: Rule) => any
): onMatchCallback
export function attachMatch(val: any): onMatchCallback
export function attachMatch(val: any) {
	const callback: (data: any, len: number, context: MatchContext, rule: Rule) => any = isFn(val) ? val : () => val
	return (data: any, len: number, context: MatchContext, rule: Rule) => {
		context.add(callback(data, len, context, rule))
	}
}

//========================================================================================
/*                                                                                      *
 *                                       match api                                      *
 *                                                                                      */
//========================================================================================

export function match(desc: MatchRuleDescriptor): MatchRule

//──── named regexp match api ────────────────────────────────────────────────────────────
// pick, start, cap
// pick, cap
// pick, start
// pick
// start, cap
// start
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
	pick: boolean | number,
	capturable: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(
	name: string,
	pattern: RegExp,
	pick: boolean | number,
	startCodes: number | string | any[],
	onMatch: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(
	name: string,
	pattern: RegExp,
	pick: boolean | number,
	onMatch: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(
	name: string,
	pattern: RegExp,
	startCodes: string | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(
	name: string,
	pattern: RegExp,
	startCodes: string | any[],
	onMatch: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(name: string, pattern: RegExp, onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule

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
	pick: boolean | number,
	capturable: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(
	pattern: RegExp,
	pick: boolean | number,
	startCodes: number | string | any[],
	onMatch: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(
	pattern: RegExp,
	pick: boolean | number,
	onMatch: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(
	pattern: RegExp,
	startCodes: string | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(
	pattern: RegExp,
	startCodes: string | any[],
	onMatch: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule
export function match(pattern: RegExp, onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule

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
	ignoreCase: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule

export function match(
	name: string,
	pattern: number | string | any[],
	onMatch: onMatchCallback,
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
	ignoreCase: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): MatchRule

export function match(pattern: number | string | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule

export function match(): MatchRule {
	return mkMatch(arguments)
}

//========================================================================================
/*                                                                                      *
 *                                     and rule api                                     *
 *                                                                                      */
//========================================================================================

//──── and ───────────────────────────────────────────────────────────────────────────────
export function and(desc: ComplexRuleDescriptor): AndRule
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
	capturable: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function and(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	onMatch: onMatchCallback,
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
	capturable: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function and(rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): AndRule
export function and(): AndRule {
	return mkComplexRule(arguments, AndRule, [1, 1])
}

//──── and any ───────────────────────────────────────────────────────────────────────────
export function any(desc: ComplexRuleDescriptor): AndRule
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
	onMatch: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function any(
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function any(rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): AndRule
export function any(): AndRule {
	return mkComplexRule(arguments, AndRule, [0, -1])
}

//──── and many ──────────────────────────────────────────────────────────────────────────
export function many(desc: ComplexRuleDescriptor): AndRule
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
	onMatch: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function many(
	rules: ((rule: Rule) => any[]) | any[],
	capturable?: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function many(rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): AndRule
export function many(): AndRule {
	return mkComplexRule(arguments, AndRule, [1, -1])
}

//──── and option ────────────────────────────────────────────────────────────────────────
export function option(desc: ComplexRuleDescriptor): AndRule
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
	onMatch: onMatchCallback,
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
	onMatch: onMatchCallback,
	onErr?: onErrorCallback
): AndRule
export function option(): AndRule {
	return mkComplexRule(arguments, AndRule, [0, 1])
}

//========================================================================================
/*                                                                                      *
 *                                      or rule api                                     *
 *                                                                                      */
//========================================================================================

//──── or ────────────────────────────────────────────────────────────────────────────────
export function or(desc: ComplexRuleDescriptor): OrRule
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
	capturable: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function or(
	name: string,
	rules: ((rule: Rule) => any[]) | any[],
	onMatch: onMatchCallback,
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
	capturable: boolean,
	onMatch?: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function or(rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): OrRule
export function or(): OrRule {
	return mkComplexRule(arguments, OrRule, [1, 1])
}

//──── or any ────────────────────────────────────────────────────────────────────────────
export function anyOne(desc: ComplexRuleDescriptor): OrRule
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
	onMatch: onMatchCallback,
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
	onMatch: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function anyOne(): OrRule {
	return mkComplexRule(arguments, OrRule, [0, -1])
}

//──── or many ───────────────────────────────────────────────────────────────────────────
export function manyOne(desc: ComplexRuleDescriptor): OrRule
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
	onMatch: onMatchCallback,
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
	onMatch: onMatchCallback,
	onErr?: onErrorCallback
): OrRule
export function manyOne(): OrRule {
	return mkComplexRule(arguments, OrRule, [1, -1])
}

//──── or option ─────────────────────────────────────────────────────────────────────────
export function optionOne(desc: ComplexRuleDescriptor): OrRule
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
export function optionOne(): OrRule {
	return mkComplexRule(arguments, OrRule, [0, 1])
}

//========================================================================================
/*                                                                                      *
 *                                  Match Rule Builder                                  *
 *                                                                                      */
//========================================================================================

export type MatchRuleDescriptor = {
	name?: string
	pattern: RegExp | number | string | any[]
	pick?: boolean | number
	startCodes?: number | string | any[]
	ignoreCase?: boolean
} & RuleOptions

function mkMatch(args: IArguments | any[], defaultMatchCallback?: onMatchCallback): MatchRule {
	let name: string,
		pattern: number | string | any[],
		regexp: RegExp,
		pick: boolean | number = 0,
		startCodes: number | string | any[],
		ignoreCase: boolean = false,
		options: RuleOptions
	if (isObj(args[0])) {
		const desc = args[0] as MatchRuleDescriptor,
			p = desc.pattern
		if (isReg(p)) {
			regexp = p as RegExp
			pick = desc.pick
			startCodes = desc.startCodes
		} else if (isStrOrCodes(p)) {
			pattern = p as number | string | any[]
			ignoreCase = desc.ignoreCase
		}
		name = desc.name
		options = desc
	} else {
		var i = 1
		if (isStr(args[0]) && isMatchPattern(args[1])) {
			name = args[0]
			isReg(args[1]) ? (regexp = args[1]) : (pattern = args[1])
			i = 2
		} else if (isMatchPattern(args[0])) {
			isReg(args[0]) ? (regexp = args[0]) : (pattern = args[0])
		}

		if (regexp) {
			if (isBool(args[i]) || isInt(args[i])) pick = args[i++]
			if (isStrOrCodes(args[i])) startCodes = args[i++]
		} else {
			if (isBool(args[i])) ignoreCase = args[i++]
		}
		options = parseRuleOptions(args, i)
	}

	!options.match && (options.match = defaultMatchCallback)

	return regexp
		? new RegMatchRule(name, regexp, options.match === discardMatch ? false : pick, startCodes, options)
		: pattern
		? strMatch(name, pattern, ignoreCase, options)
		: assert('invalid match rule {j}', args)
}

function isStrOrCodes(pattern): boolean {
	return isStr(pattern) || isNum(pattern) || isArray(pattern)
}

function isMatchPattern(pattern): boolean {
	return isReg(pattern) || isStrOrCodes(pattern)
}

function strMatch(name: string, pattern: string | number | any[], ignoreCase: boolean, options: RuleOptions) {
	const C = isStr(pattern) && (pattern as string).length > 1 ? StringMatchRule : CharMatchRule
	return new C(name, pattern, ignoreCase, options)
}

//========================================================================================
/*                                                                                      *
 *                                 complex rule builder                                 *
 *                                                                                      */
//========================================================================================

export type ComplexRuleDescriptor = {
	name?: string
	rules: ((rule: Rule) => any[]) | any[]
	repeat?: [number, number]
	capturable?: boolean
	onMatch?: onMatchCallback
	onErr?: onErrorCallback
} & RuleOptions

function mkComplexRule<T extends AndRule | OrRule>(
	args: IArguments,
	Rule: typeof AndRule | typeof OrRule,
	defaultRepeat: [number, number]
): T {
	let name: string,
		builder: ComplexRuleBuilder,
		rules: ((rule: Rule) => any[]) | any[],
		repeat: [number, number],
		options: RuleOptions
	if (isObj(args[0])) {
		const desc = args[0] as ComplexRuleDescriptor,
			r = desc.rules
		if (isArray(r) || isFn(r)) rules = r
		repeat = desc.repeat
		name = desc.name
		options = desc
	} else {
		var i = 0
		if (isStr(args[i])) name = args[i++]
		if (isArray(args[i]) || isFn(args[i])) rules = args[i++]
		if (isArray(args[i])) repeat = args[i++]
		options = parseRuleOptions(args, i)
	}
	if (!repeat) repeat = defaultRepeat
	if (rules) {
		builder = rulesBuilder(rules)
		return new Rule(name, repeat, builder, options) as T
	}
}

function rulesBuilder(rules: ((rule: Rule) => any[]) | any[]): (rule: Rule) => Rule[] {
	return function(_rule) {
		return mapArray(isFn(rules) ? (rules as ((rule: Rule) => any[]))(_rule) : (rules as any[]), (r, i) => {
			if (!r) return SKIP
			let rule: Rule = r.$rule ? r : mkMatch(isArray(r) ? r : [r], discardMatch)
			assert.is(rule, '{}: Invalid Rule Configuration on index {d}: {j}', _rule, i, r)
			return rule
		})
	}
}

//========================================================================================
/*                                                                                      *
 *                                         tools                                        *
 *                                                                                      */
//========================================================================================

function parseRuleOptions(args: IArguments | any[], i: number) {
	const options: RuleOptions = {}
	if (isBool(args[i])) options.capturable = args[i++]
	options.match = args[i++]
	options.err = args[i]
	return options
}
