/**
 * complex rule interface
 * @class ComplexRule
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
					msg.unshift(
						`[${pad(pos[0], 2)}:${pad(pos[1], 2)}] - ${err[4].toString()}: ${err[1]} on "${escapeString(
							buff.substr(err[0], 20)
						)}"`
					)
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
					push: idStackPush
				},
				map
			)
			if (id) map.push(id)
			return map
		}
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
