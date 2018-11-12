import { assert, error } from 'devlevel'
import { inherit, isObj, isFn, isStr, isNum, isInt, isArray, isBool, isReg, applyNoScope, reEscape, regStickySupport, makeMap, assign } from '../helper'
import { pad, escapeString } from './format'

// ================================================
// Text Stream
// ================================================
const LINE_REG = /\n/g

function Stream(buff) {
	this.orgbuff = buff
	this.orglen = buff.length
	// [buff, offset, orgoffset, prev, char code cache]
	const curr = [buff, 0, 0, null, null]
	this.curr = curr
	this.stack = [curr]
}
inherit(Stream, {
	enter() {
		let { curr } = this
		// [buff, offset, orgoffset, prev, char code cache]
		this.curr = curr = [curr[0], curr[1], curr[2], curr, null]
		this.stack.push(curr)
	},
	reset() {
		const { curr } = this
		const prev = curr[3]
		if (curr[2] !== prev[2]) {
			curr[0] = prev[0]
			curr[1] = prev[1]
			curr[2] = prev[2]
			curr[4] = null
			return true
		}
	},
	exit() {
		const curr = this.stack.pop()
		this.curr = curr[3]
	},
	commit() {
		const curr = this.stack.pop(),
			prev = curr[3]
		this.curr = prev
		prev[0] = curr[0]
		prev[1] = curr[1]
		prev[2] = curr[2]
		prev[4] = curr[4]
	},
	buff(reset) {
		const { curr } = this
		if (reset) {
			curr[0] = curr[0].substring(curr[1])
			curr[1] = 0
		}
		return curr[0]
	},
	offset() {
		return this.curr[1]
	},
	orgOffset() {
		return this.curr[2]
	},
	upOrgOffset() {
		const prev = this.curr[3]
		return prev ? prev[2] : 0
	},
	nextCode() {
		const { curr } = this
		if (curr[4] === null) curr[4] = curr[2] < this.orglen ? curr[0].charCodeAt(curr[1]) : 0
		return curr[4]
	},
	consume(len) {
		if (len) {
			const { curr } = this
			curr[1] += len
			curr[2] += len
			curr[4] = null
		}
	},
	position(offset) {
		const { orgbuff } = this
		let line = 0,
			lineOffset = 0

		while (LINE_REG.exec(orgbuff) && offset >= LINE_REG.lastIndex) {
			lineOffset = LINE_REG.lastIndex
			line++
		}
		LINE_REG.lastIndex = 0
		return [line, offset - lineOffset]
	},
	source() {
		const { orgbuff } = this
		let line = 1
		return ` 0: ${orgbuff.replace(LINE_REG, () => `\n${pad(line++, 2)}: `)}`
	},
})

// ================================================
// Rule Base API
// ================================================
let idGen = 0

export const MatchResult = inherit(
	function MatchResult(parent) {
		this.parent = parent
		this.data = []
	},
	{
		add(data) {
			this.data.push(data)
		},
		addAll(datas) {
			const { data } = this
			const len = data.length
			let i = datas.length
			while (i--) data[len + i] = datas[i]
		},
		empty() {
			this.setLen(0)
		},
		setLen(len) {
			const { data } = this
			if (data.length > len) data.length = len
		},
	}
)

/**
 * static Rule options
 */
export function UNATTACH() {}
export const UNCAPTURABLE = {
		capturable: false,
	},
	UNATTACH_CAPTURABLE = {
		attach: UNATTACH,
		capturable: false,
	}

function defaultErrorMsg(err) {
	return err
}

function defaultAttach(data, rs) {
	rs.add(data)
}

function defaultRuleTest() {
	return true
}

const OPTION_ATTACH = 'attach',
	OPTION_ERROR = 'error',
	OPTION_CAPTURABLE = 'capturable'
/**
 * Rule Interface
 *
 * Overrides:
 *      Rule(name, attachFunction: <Function>)
 *
 *      Rule(name, errorMsg: <String>)
 *
 * @param {String}                  name                rule name
 * @param {Function|String|Object}  option              rule option
 * @param {Function}                option.attach       data attach callback
 * @param {Boolean}                 option.capturable   error is capturable
 * @param {Function|String}         option.error        error message or error message callback
 */
export function Rule(name, option) {
	this.id = idGen++
	this.name = name
	let capturable = true,
		attach = null,
		msg = null

	if (isObj(option)) {
		attach = option[OPTION_ATTACH]
		msg = option[OPTION_ERROR]
		capturable = option[OPTION_CAPTURABLE] !== false
	} else if (isFn(option)) {
		attach = option
	} else if (isStr(option)) {
		msg = option
	}
	this.capturable = capturable
	this.attach = isFn(attach) ? attach : defaultAttach
	this.msg = isStr(msg) ? () => msg : isFn(msg) ? msg : defaultErrorMsg
}
inherit(Rule, {
	$rule: true,
	error(stream, err, capturable, srcErr) {
		err = [stream.orgOffset(), this.msg(err), capturable && srcErr ? srcErr[2] : capturable, srcErr, this]
		err.$err = true
		return err
	},
	success(stream, data, result) {
		const curr = stream.curr,
			err = this.attach(data, result, stream, this)

		assert(stream.curr == curr)

		return err && !err.$err ? this.error(stream, err, false) : err
	},
	setExpr(expr) {
		this.defName = this.mkExpr(expr)
		this.EXPECT = `Expect: ${expr}`
	},
	mkExpr(expr) {
		return `<${this.type}: ${expr}>`
	},
	toString() {
		return this.name || this.defName
	},
	getStart() {
		return []
	},
	test: defaultRuleTest,
})

// ================================================
// Match Rule API
// ================================================

function testRuleByIndex(stream) {
	return this.index[stream.nextCode()]
}

/**
 * match rule interface
 *
 * @param {String}                              name        rule name
 * @param {Int | String | Array<String | Int>}  startCodes  start codes in match
 * @param {Boolean}                             ignoreCase  is match ignore case
 * @param {?}                                   option      see Rule Constructor
 */
export const MatchRule = inherit(
	function MatchRule(name, startCodes, ignoreCase, option) {
		Rule.call(this, name, option)

		const start = [],
			index = []
		eachCharCodes(startCodes, ignoreCase, code => {
			if (!index[code]) {
				start.push(code)
				index[code] = code
			}
		})
		this.start = start
		this.index = index
		this.test = start.length ? testRuleByIndex : defaultRuleTest
	},
	Rule,
	{
		comsume(stream, data, len, result) {
			stream.consume(len)
			return this.success(stream, data, result)
		},
		getStart() {
			return this.start
		},
	}
)

// ================================================
// Char Match Rule
// ================================================

function defaultCharMatchRuleTest() {
	return stream.nextCode()
}
/**
 * match one char which in allow list
 * well match every char when allows is empty
 *
 * @param {String}                              name        rule name
 * @param {Int | String | Array<String | Int>}  allows      which char can be matched
 *                                                          well match every char when allows is empty
 * @param {Boolean}                             ignoreCase  is match ignore case
 * @param {?}                                   option      see Rule Constructor
 */
export const CharMatchRule = inherit(
	function CharMatchRule(name, allows, ignoreCase, option) {
		MatchRule.call(this, name, allows, ignoreCase, option)

		const codes = this.start
		let i = codes.length,
			expr = '*'
		if (i) {
			const chars = []
			while (i--) chars[i] = String.fromCharCode(codes[i])
			expr = `"${chars.join('" | "')}"`
		} else {
			this.test = defaultCharMatchRuleTest
		}
		this.setExpr(expr)
	},
	MatchRule,
	{
		type: 'Character',
		match: function charMatch(stream, result) {
			return this.comsume(stream, String.fromCharCode(stream.nextCode()), 1, result)
		},
	}
)

// ================================================
// Regexp Match Rule
// ================================================
/**
 * match by RegExp
 *
 * optimization:
 *      Priority use sticky mode
 *
 * @param {String}                              name        rule name
 * @param {RegExp}                              regexp      regexp
 * @param {Int | Boolean}                       pick        pick match result
 *                                                          0       : [default] pick match[0]
 *                                                                    optimize: test and substring in sticky mode
 *                                                          pick > 0: pick match[pick]
 *                                                          pick < 0: pick first matched group
 *                                                          true    : pick match
 *                                                          false   : no data pick
 *                                                                    optimize: just test string in sticky mode
 * @param {Int | String | Array<String | Int>}  startCodes  start codes of regexp
 * @param {?}                                   option      see Rule Constructor
 */
export const RegMatchRule = inherit(
	function RegMatchRule(name, regexp, pick, startCodes, option) {
		pick = pick === false || isInt(pick) ? pick : !!pick || 0

		const sticky = regStickySupport && !pick, // use exec when need pick match group data
			pattern = regexp.source,
			ignoreCase = regexp.ignoreCase

		// always wrapping in a none capturing group preceded by '^' to make sure
		// matching can only work on start of input. duplicate/redundant start of
		// input markers have no meaning (/^^^^A/ === /^A/)

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
		// When the y flag is used with a pattern, ^ always matches only at the
		// beginning of the input, or (if multiline is true) at the beginning of a
		// line.
		regexp = new RegExp(sticky ? pattern : `^(?:${pattern})`, (ignoreCase ? 'i' : '') + (regexp.multiline ? 'm' : '') + (sticky ? 'y' : ''))

		MatchRule.call(this, name, startCodes, ignoreCase, option)

		this.regexp = regexp
		this.pick = pick
		this.match = createRegMatchRulePolicy(name || `reg${this.id}`, sticky, pick)

		this.setExpr(regexp.toString())
	},
	MatchRule,
	{
		type: 'RegExp',
	}
)

/**
 * generate match function
 *
 * sticky mode:
 *      var reg = this.regexp,
 *          buff = stream.buff(),
 *          start = stream.offset()
 *      reg.lastIndex = start
 *      if (reg.test(buff))
 *          return this.comsume(stream,
 *                              this.pick === false ? null : buff.substring(start, reg.lastIndex),
 *                              reg.lastIndex - start)
 *      return this.error(stream, this.EXPECT, this.capturable, result);
 *
 * unsticky mode:
 *      var m = this.regexp.exec(stream.buff(true))
 *      if (m) {
 *          var pick = this.pick,
 *              pickData
 *          if (pick < 0) {
 *              pick = -pick
 *              for(var i = 1; i <= pick; i++) {
 *                  if (m[i]) {
 *                      pickData = m[i]
 *                      break
 *                  }
 *              }
 *          }else {
 *              pickData = pick === true ? m : m[pick || 0]
 *          }
 *          return this.comsume(stream, pickData, m[0].length, result)
 *      }
 *      return this.error(stream, this.EXPECT, this.capturable);
 *
 */
function createRegMatchRulePolicy(name, sticky, pick) {
	const R = `this.regexp`,
		STREAM = 'stream',
		S_BUFF = `${STREAM}.buff`,
		LIDX = `r.lastIndex`

	name += `_${sticky ? 'test' : 'exec'}_pick_${pick === true ? 'all' : pick < 0 ? 'one_' + -pick : pick || 0}`

	let code = sticky
		? // sticky mode
		  `var r = ${R}, b = ${S_BUFF}(), s = ${STREAM}.offset();
\t${LIDX} = s;
\tif (r.test(b))
\t\t${consumCode(pick === false ? 'null' : `b.substring(s, ${LIDX})`, `${LIDX} - s`)}`
		: // unsticky mode
		  `var m = ${R}.exec(${S_BUFF}(true));
\tif (m)
\t\t${consumCode(pick < 0 ? pickCode(-pick) : `m${pick === true ? '' : `[${pick || 0}]`}`, 'm[0].length')}`

	return new Function(`return function ${name}(${STREAM}, rs){
\t${code}
\treturn this.error(${STREAM}, this.EXPECT, this.capturable);
}`)()

	function consumCode(data, len) {
		return `return this.comsume(${STREAM}, ${data}, ${len}, rs)`
	}

	function pickCode(pick) {
		let arr = []
		for (var i = 1; i <= pick; i++) arr.push(`m[${i}]`)
		return arr.join(' || ')
	}
}

// ================================================
// String Match Rule
// ================================================
/**
 * match string
 *
 * @param {String}  name        rule name
 * @param {String}  str         match string
 * @param {Boolean} ignoreCase  is match ignore case
 * @param {?}       option      see Rule Constructor
 */
export const StrMatchRule = inherit(
	function StrMatchRule(name, str, ignoreCase, option) {
		RegMatchRule.call(this, name, new RegExp(reEscape(str), ignoreCase ? 'i' : ''), 0, str.charCodeAt(0), option)
		this.setExpr(str)
	},
	RegMatchRule,
	{
		type: 'String',
	}
)

// ================================================
// Match API
// ================================================
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

// ================================================
// Char Code Tools
// ================================================
function eachCharCodes(codes, ignoreCase, cb) {
	if (isStr(codes)) {
		var i = codes.length
		while (i--) eachCharCode(codes.charCodeAt(i), ignoreCase, cb)
	} else if (isArray(codes)) {
		var i = codes.length
		while (i--) eachCharCodes(codes[i], ignoreCase, cb)
	} else if (isInt(codes)) {
		eachCharCode(codes, ignoreCase, cb)
	}
}

function eachCharCode(code, ignoreCase, cb) {
	cb(code)
	if (ignoreCase) {
		if (code <= 90) {
			if (code >= 65) cb(code + 32)
		} else if (code <= 122) {
			cb(code - 32)
		}
	}
}

// ================================================
// Complex Rule API
// ================================================

/**
 * complex rule interface
 *
 * @param {String}              name        rule name
 * @param {Function|Array|...}  rules       complex rules
 * @param {?}                   option      see Rule Constructor
 */
export const ComplexRule = inherit(
	function ComplexRule(name, rules, option) {
		Rule.call(this, name, option)

		const getRules = this.getRules

		this.getRules = function getLazyRules() {
			this.getRules = getRules

			this.rules = rules = parseComplexRules(this, isFn(rules) ? rules() : rules, [])
			const len = (this.len = rules.length)
			assert(len, `Require Rules`)

			// parse Expression
			const names = this.subNames()
			this.setExpr(names.join(this.split))

			for (let i = 0; i < len; i++) names[i] = `Expect[${i}]: ${names[i]}`
			this.EXPECTS = names

			this.__init(rules, len)

			return this.getRules()
		}
	},
	Rule,
	{
		/**
		 * parse buffer
		 *
		 * @param {String} buff text buff
		 */
		parse(buff, errSource) {
			const result = new MatchResult(),
				stream = new Stream(buff)
			let err = this.match(stream, result)
			if (err) {
				const source = stream.source()
				var pos,
					msg = []
				do {
					pos = stream.position(err[0])
					msg.unshift(`[${pad(pos[0], 2)}:${pad(pos[1], 2)}] - ${err[4].toString()}: ${err[1]} on "${escapeString(buff.substr(err[0], 20))}"`)
					err = err[3]
				} while (err)

				if (errSource !== false) msg.push('[Source]', source)

				const e = new SyntaxError(msg.join('\n'))
				e.source = source
				throw e
			}
			return result.data
		},
		commit(stream, data, result) {
			const err = this.success(stream, data, result)

			if (err) {
				stream.exit()
				return err
			}
			stream.commit()
		},
		exit(stream, msg, srcErr) {
			const err = this.error(stream, msg, this.capturable, srcErr)
			stream.exit()
			return err
		},
		init() {
			this.getRules()
			return this
		},
		__init() {},
		getRules() {
			return this.rules
		},
		subNames(map) {
			const rules = this.getRules(),
				names = []
			for (let i = 0; i < this.len; i++) names[i] = rules[i].toString(this.idStack(this.id, map))
			return names
		},
		toString(map) {
			this.init()
			if (this.name) return this.name
			if (map) {
				const { id } = this
				if (map[id]) {
					if (map[id] === 1) return `<${this.type} -> $Self>`
					return `<${this.type} -> $${map[id]}>`
				}
				return this.mkExpr(this.subNames(map).join(this.split))
			}
			return this.defName
		},
		idStack(id, map) {
			map = assign(
				{
					level: 0,
					push: idStackPush,
				},
				map
			)
			if (id) map.push(id)
			return map
		},
	}
)

function idStackPush(id) {
	this[id] = ++this.level
	return this
}

function parseComplexRules(curr, rules, dist) {
	for (let i = 0, l = rules.length; i < l; i++) {
		if (!rules[i]) error(`Empty Rules[${i}]: ${rules}`)
		parseRule(curr, rules[i], dist)
	}
	return dist
}

function parseRule(curr, rule, dist) {
	if (rule.$rule) {
		// Rule Object
		dist.push(rule)
	} else if (isStr(rule)) {
		// match rule
		dist.push(match(rule, UNATTACH))
	} else if (isReg(rule)) {
		dist.push(match(rule, false, UNATTACH))
	} else if (isObj(rule)) {
		dist.push(match(rule))
	} else if (isArray(rule)) {
		// rule connections or match rule
		dist.push(applyNoScope(match, rule))
	} else {
		error(`Invalid Rule: ${rule}`)
	}
}

// ================================================
// Complex Rules
// ================================================
/**
 * and complex rule interface
 *
 * @param {String}              name        rule name
 * @param {Function|Array|...}  rules       complex rules
 * @param {?}                   option      see Rule Constructor
 */
export const AndRule = inherit(
	function AndRule(name, rules, option) {
		ComplexRule.call(this, name, rules, option)
	},
	ComplexRule,
	{
		type: 'And',
		split: ' + ',
		__init(rules, len) {
			const start = [],
				index = [],
				codes = rules[0].getStart(this.idStack(this.id))

			eachCharCodes(codes, false, code => {
				if (!index[code]) {
					start.push(code)
					index[code] = code
				}
			})
			this.start = start
			this.index = index
			this.test = start.length ? testRuleByIndex : defaultRuleTest
		},
		getStart(map) {
			this.init()
			if (this.start) return this.start
			if (map) {
				const { id } = this
				if (map[id]) return []
				return this.getRules()[0].getStart(this.idStack(id, map))
			}
			return this.start
		},
		match: function andMatch(stream, result) {
			const rules = this.getRules(),
				len = this.len,
				rs = new MatchResult(result)
			let err,
				i = 0

			stream.enter()
			for (; i < len; i++) {
				if (!rules[i].test(stream) || (err = rules[i].match(stream, rs))) {
					return this.exit(stream, this.EXPECTS[i], err)
				}
			}
			return this.commit(stream, rs.data, result)
		},
	}
)

export const OrRule = inherit(
	function OrRule(name, rules, option) {
		ComplexRule.call(this, name, rules, option)
	},
	ComplexRule,
	{
		type: 'Or',
		split: ' | ',
		__init(rules, len) {
			const starts = [], // all distinct start codes
				rStarts = [], // start codes per rule
				index = [
					[], // rules witch have unkown start code
				]

			let i, j, k, codes

			// get start codes of all rules
			for (i = 0; i < len; i++) {
				rStarts[i] = []
				codes = rules[i].getStart(this.idStack(this.id))
				eachCharCodes(codes, false, code => {
					rStarts[i].push(code)
					if (!index[code]) {
						// init index
						index[code] = []
						starts.push(code)
					}
				})
			}

			// fill index
			for (i = 0; i < len; i++) {
				codes = rStarts[i]
				if (!codes.length) {
					// rules[i] not unkown start code
					index[0].push(rules[i]) // append rules[i] to index[0]
					codes = starts // append rules[i] to all start code index
				}
				// append rules[i] to start code index
				j = codes.length
				while (j--) {
					k = index[codes[j]]
					if (k.idx !== i) {
						// deduplication
						k.push(rules[i]) // append rules[i] to start code index[codes[j]]
						k.idx = i
					}
				}
			}

			this.rStarts = rStarts
			// rule have unkown start code when got unkown start code from any rules
			this.start = index[0].length ? [] : starts
			this.test = starts.length && !index[0].length ? testRuleByIndex : this.test

			if (starts.length)
				// not use index when got unkown start code from every rules
				this.index = index
		},
		getStart(map) {
			this.init()
			if (this.start) return this.start
			if (map) {
				const { id } = this
				if (map[id]) return []

				const rules = this.getRules(),
					starts = []
				for (var i = 0, start; i < this.len; i++) {
					start = rules[i].getStart(this.idStack(id, map))
					if (!start.length) return []
					starts[i] = start
				}
				return starts
			}
			return this.start
		},
		match: function orMatch(stream, result) {
			const { index } = this
			const rules = index ? index[stream.nextCode()] || index[0] : this.getRules(),
				len = rules.length

			const rs = new MatchResult(result)
			var err, upErr, i
			stream.enter()
			for (i = 0; i < len; i++) {
				if (!(err = rules[i].match(stream, rs)) && !(err = this.success(stream, rs.data, result))) {
					stream.commit()
					return
				}
				if (!err[2])
					// not capturable error
					return this.exit(stream, this.EXPECTS[i], err)

				if (!upErr || err[0] >= upErr[0]) upErr = err
				stream.reset()
				rs.empty()
			}
			return this.exit(stream, this.EXPECT, upErr)
		},
	}
)

function createRepeatRule(defType, Parent, match) {
	return inherit(
		function AndRepeatRule(name, type, min, max, rules, option) {
			if (min < 0) min = 0
			if (max <= 0) max = 999999
			assert(min < max)

			Parent.call(this, name, rules, option)

			this.min = min
			this.max = max
			this.type = type || `${defType}[${min} - ${max}]`
		},
		Parent,
		{
			__init(rules, len) {
				Parent.prototype.__init.call(this, rules, len)
				if (!this.min) this.test = defaultRuleTest
			},
			match,
		}
	)
}

export const AndRepeatRule = createRepeatRule('AndRepeat', AndRule, function andRepeatMatch(stream, result) {
	const { min, max } = this
	const rules = this.getRules(),
		len = this.len,
		rs = new MatchResult(result),
		data = rs.data

	let err,
		repeat = 0,
		i,
		l

	stream.enter()
	out: for (; repeat < max; repeat++) {
		l = data.length
		stream.enter()
		for (i = 0; i < len; i++) {
			if (!rules[i].test(stream) || (err = rules[i].match(stream, rs))) {
				if (repeat < min || (err && !err[2])) {
					// have no enough data or error is not capturable
					err = this.exit(stream, this.EXPECTS[i], err)
					stream.exit()
					return err
				}
				stream.exit()
				rs.setLen(l)
				break out
			}
		}
		stream.commit()
	}
	return this.commit(stream, data, result)
})

export const OrRepeatRule = createRepeatRule('OrRepeat', OrRule, function orRepeatMatch(stream, result) {
	const { min, max, index } = this
	const rs = new MatchResult(result),
		data = rs.data
	let err,
		upErr,
		repeat = 0,
		i,
		l,
		rules,
		len

	if (!index) {
		rules = this.getRules()
		len = rules.length
	}

	stream.enter() // outer: enter
	out: for (; repeat < max; repeat++) {
		if (index) {
			rules = index[stream.nextCode()] || index[0]
			len = rules.length
		}
		if (len) {
			upErr = null
			l = data.length
			stream.enter() // inner: enter
			for (i = 0; i < len; i++) {
				if (!(err = rules[i].match(stream, rs))) {
					stream.commit() // inner: commit
					continue out
				}
				if (!err[2]) {
					// not capturable error
					err = this.exit(stream, this.EXPECTS[i], err) // inner: exit
					stream.exit() // outer: exit
					return err
				}
				if (!upErr || err[0] >= upErr[0]) upErr = err
				stream.reset()
				rs.setLen(l)
			}
			if (repeat < min) {
				err = this.exit(stream, this.EXPECT, upErr) // inner: exit
				stream.exit() // outer: exit
				return err
			}
		} else if (repeat < min) return this.exit(stream, this.EXPECT) // outer: exit
		break
	}
	return this.commit(stream, data, result) // outer: commit
})

// ================================================
// Rule APIs
// ================================================

/**
 * and(name, rules[], option)
 *
 * and(name, rules..., option)
 *
 * and(rules[], option)
 *
 * and(rules..., option)
 *
 * and({
 *      name,
 *      rules,
 *      option
 * })
 * @param {String}                                                  name    [option] rule name
 * @param {(Array|Arguments)<Rule|String|RegExp|Function>|Function} rules   match rules
 * @param {Function}                                                option  see Rule.option
 */
export function and() {
	return buildComplexRule(arguments, 0, (name, rules, option) => new AndRule(name, rules, option))
}

export function or() {
	return buildComplexRule(arguments, 0, (name, rules, option) => new OrRule(name, rules, option))
}

function buildRepeatRule(args, i, type, min, max, C) {
	return buildComplexRule(args, i, (name, rules, option) => new C(name, type, min, max, rules, option))
}

function buildAndRepeatRule(args, i, type, min, max, C) {
	return buildRepeatRule(args, i, type, min, max, AndRepeatRule)
}
export function any() {
	return buildAndRepeatRule(arguments, 0, 'Any', 0, -1)
}

export function many() {
	return buildAndRepeatRule(arguments, 0, 'Many', 1, -1)
}

export function option() {
	return buildAndRepeatRule(arguments, 0, 'Option', 0, 1)
}

export function repeat(min, max) {
	return buildAndRepeatRule(arguments, 2, 0, min, max)
}

function buildOrRepeatRule(args, i, type, min, max, C) {
	return buildRepeatRule(args, i, type, min, max, OrRepeatRule)
}
export function anyOne() {
	return buildOrRepeatRule(arguments, 0, 'AnyOne', 0, -1)
}

export function manyOne() {
	return buildOrRepeatRule(arguments, 0, 'ManyOne', 1, -1)
}

export function optionOne() {
	return buildOrRepeatRule(arguments, 0, 'OptionOne', 0, 1)
}

export function repeatOne(min, max) {
	return buildOrRepeatRule(arguments, 2, 0, min, max)
}

function buildComplexRule(args, i, build) {
	const arglen = args.length

	let name = 0,
		rules,
		option = null

	if (isObj(args[i])) {
		name = args[i].name
		rules = args[i].rules
		option = args[i]
	} else {
		if (isStr(args[i])) name = args[i++]

		if (isArray(args[i]) || isFn(args[i])) {
			rules = args[i++]
			option = args[i]
		} else {
			rules = []
			for (; i < arglen - 1; i++) rules.push(args[i])
			if (isFn(args[i]) || isObj(args[i]) || isStr(args[i])) option = args[i]
			else if (args[i]) rules.push(args[i])
		}
	}
	return build(name, rules, option)
}
