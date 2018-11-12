import FnList from '../FnList'

function createTestObjs(size) {
	let objs = new Array(size),
		i = 0
	for (; i < size; i++)
		objs[i] = {
			i: i,
			fn: (function(i) {
				return function() {
					return i
				}
			})(i),
		}
	return objs
}

describe('FnList', () => {
	it('add', () => {
		let list = new FnList(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		function checkList() {
			let i = 0,
				l = objs.length
			expect(list.size()).to.equal(l)
			for (i = 0; i < l; i++) {
				expect(list.has(objs[i].fn, objs[i])).to.equal(true)
				expect(list.has(objs[i].fn)).to.equal(false)
			}
			i = 0
			list.each((fn, scope) => {
				let obj = objs[i++]
				expect(fn).to.equal(obj.fn)
				expect(scope).to.equal(obj)
			})
		}
		expect(list.size()).to.equal(0)

		// add
		for (; i < l; i++) expect(list.add(objs[i].fn, objs[i])).to.equal(i + 1)
		checkList()

		// readd
		for (; i < l; i++) expect(list.add(objs[i].fn, objs[i])).to.equal(false)
		checkList()
	})

	it('remove', () => {
		let list = new FnList(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		// init
		for (; i < l; i++) list.add(objs[i].fn, objs[i])

		// remove
		let removed = 0
		for (i = 0; i < l; i += 2) {
			removed++
			expect(list.remove(objs[i].fn)).to.equal(false)
			expect(list.has(objs[i].fn, objs[i])).to.equal(true)
			expect(list.remove(objs[i].fn, objs[i])).to.equal(l - removed)
			expect(list.has(objs[i].fn, objs[i])).to.equal(false)
			expect(list.size()).to.equal(l - removed)
		}
		for (i = 0; i < l; i++) {
			if (i % 2 === 0) {
				expect(list.remove(objs[i].fn, objs[i])).to.equal(false)
			} else {
				removed++
				expect(list.remove(objs[i].fn)).to.equal(false)
				expect(list.has(objs[i].fn, objs[i])).to.equal(true)
				expect(list.remove(objs[i].fn, objs[i])).to.equal(l - removed)
			}
			expect(list.has(objs[i].fn, objs[i])).to.equal(false)
			expect(list.size()).to.equal(l - removed)
		}
		expect(list.head).to.equal(undefined)
		expect(list.tail).to.equal(undefined)
		expect(list.size()).to.equal(0)
	})

	it('remove in scaning', () => {
		let list = new FnList(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		// init
		for (; i < l; i++) list.add(objs[i].fn, objs[i])

		// remove
		let removed = 0
		i = 0
		list.each((fn, scope) => {
			if (i % 2 === 0) {
				removed += 1
				expect(list.remove(fn)).to.equal(false)
				expect(list.has(fn, scope)).to.equal(true)
				expect(list.remove(fn, scope)).to.equal(l - removed)
				expect(list.has(fn, scope)).to.equal(false)
				expect(list.size()).to.equal(l - removed)
			}
			i++
		})
		expect(list.size()).to.equal(l / 2)

		list.each((fn, scope) => {
			removed += 1
			expect(list.remove(fn)).to.equal(false)
			expect(list.has(fn, scope)).to.equal(true)
			expect(list.remove(fn, scope)).to.equal(l - removed)
			expect(list.has(fn, scope)).to.equal(false)
			expect(list.size()).to.equal(l - removed)
		})
		expect(list.head).to.equal(undefined)
		expect(list.tail).to.equal(undefined)
		expect(list.size()).to.equal(0)
	})

	it('clean', () => {
		let list = new FnList(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		// init
		for (; i < l; i++) list.add(objs[i].fn, objs[i])

		list.clean()

		for (i = 0; i < l; i++) expect(list.has(objs[i].fn, objs[i])).to.equal(false)

		expect(list.head).to.equal(undefined)
		expect(list.tail).to.equal(undefined)
		expect(list.size()).to.equal(0)
	})

	it('clean in scaning', () => {
		let list = new FnList(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		// init
		for (; i < l; i++) list.add(objs[i].fn, objs[i])

		list.each((fn, scope) => {
			list.clean()
		})

		for (i = 0; i < l; i++) expect(list.has(objs[i].fn, objs[i])).to.equal(false)

		expect(list.head).to.equal(undefined)
		expect(list.tail).to.equal(undefined)
		expect(list.size()).to.equal(0)
	})
})
