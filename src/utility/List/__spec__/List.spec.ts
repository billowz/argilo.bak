import { List } from '../List'
import { get } from '../../propPath'
import { assert } from '../../assert'

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
			assert.eq(list.size(), l)
			for (i = 0; i < l; i++) {
				assert.eq(list.has(objs[i]), true)
			}

			i = 0
			let num = 0
			list.each(obj => {
				assert.eq(objs[i++], obj)
				num++
			})
			assert.eq(num, l)

			assert.eq(get(list, 'head[0]'), objs[0])
			assert.eq(get(list, 'tail[0]'), objs[l - 1])

			let node = get(list, 'head')
			for (i = 0; i < l; i++) {
				assert.eq(node[0], objs[i])
				node = node[2]
			}
		}

		assert.eq(get(list, 'head'), undefined)
		assert.eq(get(list, 'tail'), undefined)
		assert.eq(list.size(), 0)

		// add
		for (; i < l; i++) assert.eq(list.add(objs[i]), i + 1)
		checkList()

		// readd
		for (; i < l; i++) assert.eq(list.add(objs), false)
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
			assert.eq(list.has(objs[i]), true)
			assert.eq(list.remove(objs[i]), l - removed)
			assert.eq(list.has(objs[i]), false)
			assert.eq(list.size(), l - removed)
		}
		for (i = 0; i < l; i++) {
			if (i % 2 === 0) {
				assert.eq(list.has(objs[i]), false)
				assert.throw(() => list.remove(objs[i]), 'Object is not in this List')
			} else {
				removed++
				assert.eq(list.has(objs[i]), true)
				assert.eq(list.remove(objs[i]), l - removed)
				assert.eq(list.has(objs[i]), false)
			}
			assert.eq(list.size(), l - removed)
		}
		assert.eq(get(list, 'head'), undefined)
		assert.eq(get(list, 'tail'), undefined)
		assert.eq(list.size(), 0)
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
				assert.eq(objs[i], obj)
				assert.eq(list.has(obj), true)
				assert.eq(list.remove(obj), l - removed)
				assert.eq(list.has(obj), false)
				assert.eq(list.size(), l - removed)
			}
			i++
		})
		assert.eq(list.size(), l / 2)

		list.each(obj => {
			removed += 1
			assert.eq(list.has(obj), true)
			assert.eq(list.remove(obj), l - removed)
			assert.eq(list.has(obj), false)
			assert.eq(list.size(), l - removed)
		})
		assert.eq(get(list, 'head'), undefined)
		assert.eq(get(list, 'tail'), undefined)
		assert.eq(list.size(), 0)
	})

	it('clean', () => {
		let list = new List(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		// init
		for (; i < l; i++) list.add(objs[i])

		list.clean()

		for (i = 0; i < l; i++) assert.eq(list.has(objs[i]), false)

		assert.eq(get(list, 'head'), undefined)
		assert.eq(get(list, 'tail'), undefined)
		assert.eq(list.size(), 0)
	})

	it('clean in scaning', () => {
		let list = new List(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		// init
		for (; i < l; i++) list.add(objs[i])

		list.each(fn => {
			list.clean()
		})

		for (i = 0; i < l; i++) assert.eq(list.has(objs[i]), false)

		assert.eq(get(list, 'head'), undefined)
		assert.eq(get(list, 'tail'), undefined)
		assert.eq(list.size(), 0)
	})
})
