import FnList from '../FnList'

suite('create FnList', function() {
	benchmark('new FnList', function() {
		const list = new FnList()
	})
	benchmark('new Array', function() {
		const arr = []
	})
})

perf(10)

perf(100)

perf(1000)

perf(10000)

function createTestObjs(size) {
	let objs = new Array(size),
		i = 0

	function fn() {}
	for (; i < size; i++)
		objs[i] = {
			fn,
			scope: undefined,
		}
	return objs
}

function perf(listSize) {
	suite('add empty FnList x' + listSize, function() {
		benchmark('FnList.add', function() {
			const objs = createTestObjs(listSize)
			const list = new FnList()

			for (let i = 0, l = objs.length, obj; i < l; i++) {
				obj = objs[i]
				list.add(obj.fn, obj.scope)
			}
		})

		benchmark('Array.push', function() {
			const objs = createTestObjs(listSize)
			const array = []
			for (let i = 0, l = objs.length, obj; i < l; i++) {
				obj = objs[i]
				addArray(array, obj.fn, obj.scope)
			}
		})
	})

	suite('add full FnList x' + listSize, function() {
		let objs = createTestObjs(listSize),
			list = new FnList(),
			array = objs.slice()
		for (let i = 0, l = objs.length, obj; i < l; i++) {
			obj = objs[i]
			list.add(obj.fn, obj.scope)
		}

		benchmark('FnList.add', function() {
			for (let i = 0, l = objs.length, obj; i < l; i++) {
				obj = objs[i]
				list.add(obj.fn, obj.scope)
			}
		})

		benchmark('Array.push', function() {
			for (let i = 0, l = objs.length, obj; i < l; i++) {
				obj = objs[i]
				addArray(array, obj.fn, obj.scope)
			}
		})
	})

	suite('add & remove FnList x' + listSize, function() {
		const objs = createTestObjs(listSize)
		const list = new FnList()

		benchmark('FnList.add & FnList.remove', function() {
			for (let i = 0, l = objs.length, obj; i < l; i++) {
				obj = objs[i]
				list.add(obj.fn, obj.scope)
			}

			for (let i = 0, l = objs.length, obj; i < l; i++) {
				obj = objs[i]
				list.remove(obj.fn, obj.scope)
			}
		})

		benchmark('Array.slice & Array.splice', function() {
			const array = objs.slice()
			for (let i = 0, l = objs.length, obj; i < l; i++) {
				obj = objs[i]
				removeArray(array, obj.fn, obj.scope)
			}
		})
	})

	suite('add & rev-remove FnList x' + listSize, function() {
		const objs = createTestObjs(listSize)
		const list = new FnList()

		benchmark('FnList.add & FnList.remove', function() {
			for (let i = 0, l = objs.length, obj; i < l; i++) {
				obj = objs[i]
				list.add(obj.fn, obj.scope)
			}

			let i = objs.length,
				obj
			while (i--) {
				obj = objs[i]
				list.remove(obj.fn, obj.scope)
			}
		})

		benchmark('Array.slice && Array.splice', function() {
			const array = objs.slice()
			let i = objs.length
			while (i--) {
				obj = objs[i]
				removeArray(array, obj.fn, obj.scope)
			}
		})
	})

	suite('each FnList x' + listSize, function() {
		const objs = createTestObjs(listSize)
		const list = new FnList()
		for (let i = 0, l = objs.length, obj; i < l; i++) {
			obj = objs[i]
			list.add(obj.fn, obj.scope)
		}

		let nr1 = 0,
			nr2 = 0

		function cb1(fn, scope) {
			nr1++
		}

		function cb2(fn, scope) {
			nr2++
		}
		benchmark('FnList.each', function() {
			list.each(cb1)

			nr1 = 0
		})

		benchmark('each Array', function() {
			const array = objs.slice()
			for (let i = 0, l = array.length, obj; i < l; i++) {
				obj = array[i]
				cb2(obj.fn, obj.scope)
			}

			nr2 = 0
		})
	})

	suite('run FnList x' + listSize, function() {
		const objs = createTestObjs(listSize)
		const objs2 = createTestObjs(listSize)
		const list = new FnList()
		for (let i = 0, l = objs.length, obj; i < l; i++) {
			obj = objs[i]
			obj.fn = cb1
			list.add(obj.fn, obj.scope)
		}

		for (let i = 0, l = objs2.length; i < l; i++) {
			objs2[i].fn = cb2
		}

		let nr1 = 0,
			nr2 = 0

		function cb1(a) {
			nr1++
		}

		function cb2(a) {
			nr2++
		}

		benchmark('FnList.run', function() {
			list.run(this, [1])

			nr1 = 0
		})

		benchmark('each Array & callback', function() {
			const array = objs2.slice()
			for (let i = 0, l = array.length, obj; i < l; i++) {
				obj = array[i]
				obj.fn.call(obj.scope, 2)
			}

			nr2 = 0
		})
	})
}

function addArray(array, fn, scope) {
	let i = array.length
	while (i--) {
		if (array[i].fn === fn && array[i].scope === scope) break
	}
	if (i === -1) {
		array.push({
			fn,
			scope,
		})
	}
}

function removeArray(array, fn, scope) {
	let i = array.length
	while (i--) {
		if (array[i].fn === fn && array[i].scope === scope) {
			array.splice(i, 1)
			return
		}
	}
}
