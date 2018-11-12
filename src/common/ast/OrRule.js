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
