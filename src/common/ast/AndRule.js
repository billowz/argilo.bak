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
