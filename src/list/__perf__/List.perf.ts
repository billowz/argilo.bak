import { List } from '../List'

suite('create list', function() {
	benchmark('new List', function() {
		const list = new List()
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
	for (; i < size; i++) {
		objs[i] = {
			i: i
		}
	}
	return objs
}

function perf(listSize) {
	suite('add empty list x' + listSize, function() {
		benchmark('List.add', function() {
			const objs = createTestObjs(listSize)
			const list = new List()

			for (let i = 0, l = objs.length; i < l; i++) {
				list.add(objs[i])
			}
		})

		benchmark('Array.push', function() {
			const objs = createTestObjs(listSize)
			const array = []
			for (let i = 0, l = objs.length; i < l; i++) {
				addArray(array, objs[i])
			}
		})
	})

	suite('add full list x' + listSize, function() {
		let objs = createTestObjs(listSize),
			list = new List(),
			array = objs.slice()
		for (let i = 0, l = objs.length; i < l; i++) {
			list.add(objs[i])
		}

		benchmark('List.add', function() {
			for (let i = 0, l = objs.length; i < l; i++) {
				list.add(objs[i])
			}
		})

		benchmark('Array.push', function() {
			for (let i = 0, l = objs.length; i < l; i++) {
				addArray(array, objs[i])
			}
		})
	})

	suite('add & remove list x' + listSize, function() {
		const objs = createTestObjs(listSize)
		const list = new List()

		benchmark('List.add & List.remove', function() {
			for (let i = 0, l = objs.length; i < l; i++) {
				list.add(objs[i])
			}

			for (let i = 0, l = objs.length; i < l; i++) {
				list.remove(objs[i])
			}
		})

		benchmark('Array.slice & Array.splice', function() {
			const array = objs.slice()
			for (let i = 0, l = objs.length; i < l; i++) {
				removeArray(array, objs[i])
			}
		})
	})

	suite('add & rev-remove list x' + listSize, function() {
		const objs = createTestObjs(listSize)
		const list = new List()

		benchmark('List.add & List.remove', function() {
			for (let i = 0, l = objs.length; i < l; i++) {
				list.add(objs[i])
			}

			let i = objs.length
			while (i--) {
				list.remove(objs[i])
			}
		})

		benchmark('Array.slice & Array.splice', function() {
			const array = objs.slice()
			let i = objs.length
			while (i--) {
				removeArray(array, objs[i])
			}
		})
	})

	suite('each list x' + listSize, function() {
		const objs = createTestObjs(listSize)
		const list = new List()
		for (let i = 0, l = objs.length; i < l; i++) {
			list.add(objs[i])
		}

		let nr1 = 0,
			nr2 = 0

		function cb1(v) {
			nr1++
		}

		function cb2(v) {
			nr2++
		}
		benchmark('List.each', function() {
			list.each(cb1)

			nr1 = 0
		})

		benchmark('each Array', function() {
			const array = objs.slice()
			for (let i = 0, l = array.length; i < l; i++) {
				cb2(array[i])
			}

			nr2 = 0
		})
	})
}

function addArray(array, obj) {
	let i = array.length
	while (i--) {
		if (array[i] === obj) break
	}
	if (i === -1) {
		array.push(obj)
	}
}

function removeArray(array, obj) {
	let i = array.length
	while (i--) {
		if (array[i] === obj) {
			array.splice(i, 1)
			return
		}
	}
}
