/**
 *
 * Overrides:
 *      match(name, regexp, pick, start, option)
 *
 *      match(name, regexp, start, option)
 *
 *      match(name, regexp, option: <Object>)
 *
 *      match(regexp, pick, start, option)
 *
 *      match(regexp, start, option)
 *
 *      match(regexp, option)
 *
 *      match(name, str, ignoreCase, option)
 *
 *      match(name, str, option)
 *
 *      match(str, ignoreCase, option)
 *
 *      match(str, option: <Object>)
 *
 *      match({
 *           name,
 *           pattern: <String>
 *           ignoreCase,
 *           // option...
 *           attach: <Function>,
 *           capturable: <Boolean>,
 *           error: <Function|String>
 *      })
 *      match({
 *           name,
 *           pattern: <RegExp>
 *           pick,
 *           startCodes,
 *           // option...
 *           attach: <Function>,
 *           capturable: <Boolean>,
 *           error: <Function|String>
 *      })
 *
 * @param {String}                              name        [Option] rule name
 * @param {String | RegExp}                     pattern     match pattern: String pattern | RegExp pattern
 * @param {Boolean}                             ignoreCase  [Option] [String pattern] is match ignore Case
 * @param {Int | true}                          pick        [Option] [RegExp pattern] pick match result, default: 0
 * @param {Int | String | Array<Int | String>}  startCodes  [Option] [RegExp pattern] start codes of RegExp
 * @param {?}                                   option      [Option] see Rule Constructor
 * @return {MatchRule}
 */
export function match(name, pattern) {
	const args = arguments
	let i = 2

	if (isReg(name) || !(isReg(pattern) || isStr(pattern))) {
		pattern = name
		name = null
		i = 1
	}

	if (isReg(pattern)) {
		var pick = args[i++],
			startCodes = args[i++],
			option = args[i++]

		if (!isBool(pick) && !isInt(pick)) {
			option = startCodes
			startCodes = pick
			pick = 0
		}
		if (!isStr(startCodes) && !isNum(startCodes) && !isArray(startCodes)) {
			option = startCodes
			startCodes = null
		}
		return regMatch(name, pattern, pick, startCodes, option)
	}

	if (isStr(pattern) || isArray(pattern)) {
		// string pattern | char[] pattern
		var ignoreCase = args[i++],
			option = args[i++]

		if (!isBool(ignoreCase)) {
			option = ignoreCase
			ignoreCase = false
		}
		return strMatch(name, pattern, ignoreCase, option)
	}

	if (isObj(pattern)) {
		const _pattern = pattern.pattern,
			name = pattern.name,
			option = pattern.option
		if (isReg(_pattern)) return regMatch(name, _pattern, pattern.pick, pattern.startCodes, option)
		if (isStr(_pattern)) return strMatch(name, _pattern, pattern.ignoreCase, option)
	}
	error(`Invalid Match Rule: ${pattern}`)
}

function strMatch(name, pattern, ignoreCase, option) {
	const C = isArray(pattern) || pattern.length <= 1 ? CharMatchRule : StrMatchRule
	return new C(name, pattern, ignoreCase, option)
}

const REG_ESPEC_CHARS = makeMap('dDsStrnt0cbBfvwW', '', 1)

function regMatch(name, pattern, pick, startCodes, option) {
	const source = pattern
	if (!pick) {
		var c = 0
		if (source.length == 1 && source !== '^' && source !== '$') {
			c = source === '.' ? '' : source
		} else if (source.length == 2 && source[0] === '\\' && REG_ESPEC_CHARS[source[1]]) {
			c = source[1]
		}
		if (c != 0) return strMatch(name, c, pattern.ignoreCase, option)
	}
	return new RegMatchRule(name, pattern, pick, startCodes, option)
}
