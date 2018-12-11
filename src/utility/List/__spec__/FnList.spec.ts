import { FnList } from '../FnList'
import { assert } from '../../assert'

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
			})(i)
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
			assert.eq(list.size(), l)
			for (i = 0; i < l; i++) {
				assert.eq(list.has(objs[i].fn, objs[i]), true)
				assert.eq(list.has(objs[i].fn), false)
			}
			i = 0
			list.each((fn, scope) => {
				let obj = objs[i++]
				assert.eq(fn, obj.fn)
				assert.eq(scope, obj)
			})
		}
		assert.eq(list.size(), 0)

		// add
		for (; i < l; i++) assert.eq(list.add(objs[i].fn, objs[i]), i + 1)
		checkList()

		// readd
		for (; i < l; i++) assert.eq(list.add(objs[i].fn, objs[i]), false)
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
			assert.eq(list.remove(objs[i].fn), -1)
			assert.eq(list.has(objs[i].fn, objs[i]), true)
			assert.eq(list.remove(objs[i].fn, objs[i]), l - removed)
			assert.eq(list.has(objs[i].fn, objs[i]), false)
			assert.eq(list.size(), l - removed)
		}
		for (i = 0; i < l; i++) {
			if (i % 2 === 0) {
				assert.eq(list.remove(objs[i].fn, objs[i]), -1)
			} else {
				removed++
				assert.eq(list.remove(objs[i].fn), -1)
				assert.eq(list.has(objs[i].fn, objs[i]), true)
				assert.eq(list.remove(objs[i].fn, objs[i]), l - removed)
			}
			assert.eq(list.has(objs[i].fn, objs[i]), false)
			assert.eq(list.size(), l - removed)
		}
		assert.eq(list.size(), 0)
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
				assert.eq(list.remove(fn), -1)
				assert.eq(list.has(fn, scope), true)
				assert.eq(list.remove(fn, scope), l - removed)
				assert.eq(list.has(fn, scope), false)
				assert.eq(list.size(), l - removed)
			}
			i++
		})
		assert.eq(list.size(), l / 2)

		list.each((fn, scope) => {
			removed += 1
			assert.eq(list.remove(fn), -1)
			assert.eq(list.has(fn, scope), true)
			assert.eq(list.remove(fn, scope), l - removed)
			assert.eq(list.has(fn, scope), false)
			assert.eq(list.size(), l - removed)
		})
		assert.eq(list.size(), 0)
	})

	it('clean', () => {
		let list = new FnList(),
			objs = createTestObjs(10),
			i = 0,
			l = objs.length

		// init
		for (; i < l; i++) list.add(objs[i].fn, objs[i])

		list.clean()

		for (i = 0; i < l; i++) assert.eq(list.has(objs[i].fn, objs[i]), false)

		assert.eq(list.size(), 0)
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

		for (i = 0; i < l; i++) assert.eq(list.has(objs[i].fn, objs[i]), false)

		assert.eq(list.size(), 0)
	})
})
