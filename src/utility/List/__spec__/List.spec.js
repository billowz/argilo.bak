import List from '../List'

function createTestObjs(size) {
	let objs = new Array(size),
		i = 0
	for (; i < size; i++)
		objs[i] = {
			i: i
		}
	return objs
}

describe('List', () => {
	it('add', () => {
		let list = new List(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		function checkList() {
			let i = 0,
				l = objs.length
			expect(list.length).to.equal(l)
			for (i = 0; i < l; i++) {
				expect(list.has(objs[i])).to.equal(true)
			}

			i = 0
			let num = 0
			list.each(obj => {
				expect(objs[i++]).to.equal(obj)
				num++
			})
			expect(num).to.equal(l)

			expect(list.head[0]).to.equal(objs[0])
			expect(list.tail[0]).to.equal(objs[l - 1])

			let node = list.head
			for (i = 0; i < l; i++) {
				expect(node[0]).to.equal(objs[i])
				node = node[2]
			}
		}

		expect(list.head).to.equal(undefined)
		expect(list.tail).to.equal(undefined)
		expect(list.length).to.equal(0)

		// add
		for (; i < l; i++) expect(list.add(objs[i])).to.equal(i + 1)
		checkList()

		// readd
		for (; i < l; i++) expect(list.add(objs)).to.equal(false)
		checkList()
	})

	it('remove', () => {
		let list = new List(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		// init
		for (; i < l; i++) list.add(objs[i])

		// remove
		let removed = 0
		for (i = 0; i < l; i += 2) {
			removed++
			expect(list.has(objs[i])).to.equal(true)
			expect(list.remove(objs[i])).to.equal(l - removed)
			expect(list.has(objs[i])).to.equal(false)
			expect(list.length).to.equal(l - removed)
		}
		for (i = 0; i < l; i++) {
			if (i % 2 === 0) {
				expect(list.has(objs[i])).to.equal(false)
				expect(() => list.remove(objs[i])).to.throwException('Object is not in this List')
			} else {
				removed++
				expect(list.has(objs[i])).to.equal(true)
				expect(list.remove(objs[i])).to.equal(l - removed)
				expect(list.has(objs[i])).to.equal(false)
			}
			expect(list.length).to.equal(l - removed)
		}
		expect(list.head).to.equal(undefined)
		expect(list.tail).to.equal(undefined)
		expect(list.length).to.equal(0)
	})

	it('remove in scaning', () => {
		let list = new List(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		// init
		for (; i < l; i++) list.add(objs[i])

		// remove
		let removed = 0
		i = 0
		list.each(obj => {
			if (i % 2 === 0) {
				removed += 1
				expect(objs[i]).to.equal(obj)
				expect(list.has(obj)).to.equal(true)
				expect(list.remove(obj)).to.equal(l - removed)
				expect(list.has(obj)).to.equal(false)
				expect(list.length).to.equal(l - removed)
			}
			i++
		})
		expect(list.length).to.equal(l / 2)

		list.each(obj => {
			removed += 1
			expect(list.has(obj)).to.equal(true)
			expect(list.remove(obj)).to.equal(l - removed)
			expect(list.has(obj)).to.equal(false)
			expect(list.length).to.equal(l - removed)
		})
		expect(list.head).to.equal(undefined)
		expect(list.tail).to.equal(undefined)
		expect(list.length).to.equal(0)
	})

	it('clean', () => {
		let list = new List(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		// init
		for (; i < l; i++) list.add(objs[i])

		list.clean()

		for (i = 0; i < l; i++) expect(list.has(objs[i])).to.equal(false)

		expect(list.head).to.equal(undefined)
		expect(list.tail).to.equal(undefined)
		expect(list.length).to.equal(0)
	})

	it('clean in scaning', () => {
		let list = new List(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		// init
		for (; i < l; i++) list.add(objs[i])

		list.each((fn, scope) => {
			list.clean()
		})

		for (i = 0; i < l; i++) expect(list.has(objs[i])).to.equal(false)

		expect(list.head).to.equal(undefined)
		expect(list.tail).to.equal(undefined)
		expect(list.length).to.equal(0)
	})
})
