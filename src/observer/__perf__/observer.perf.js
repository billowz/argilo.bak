import { observer, observe, unobserve, isObserved, $eq, proxy, source, $hasOwnProp, get, set } from '../index'
import { isPrimitive, hasOwnProp } from '../../helper'
import { parsePath } from '../../common'
/*
bechPath(1, observePerf, true)
bechPath(2, observePerf, true)
bechPath(3, observePerf, true)
bechPath(4, observePerf, true)

bechPath(1, observePerf, false)
bechPath(2, observePerf, false)
bechPath(3, observePerf, false)
bechPath(4, observePerf, false)

bechPath(1, unobservePerf, true)
bechPath(2, unobservePerf, true)
bechPath(3, unobservePerf, true)
bechPath(4, unobservePerf, true)

bechPath(1, unobservePerf, false)
bechPath(2, unobservePerf, false)
bechPath(3, unobservePerf, false)
bechPath(4, unobservePerf, false)

watchBench(1)
watchBench(10)
 */

suite('observer (same object)', function() {
	const obj = {},
		array = []
	benchmark('Observer: object', function() {
		observer(obj)
	})
	benchmark('Observer: array', function() {
		observer(array)
	})
})

suite('observer (diff object)', function() {
	benchmark('Observer: object', function() {
		observer({})
	})
	benchmark('Observer: array', function() {
		observer([])
	})
})

suite('observer: $hasOwnProp', function() {
	const obj = {
		a: 1
	}
	const p = observer({ a: 1 }).proxy
	benchmark('observer.$hasOwnProp', function() {
		$hasOwnProp(obj, 'a')
	})

	benchmark('observer.$hasOwnProp by proxy', function() {
		$hasOwnProp(p, 'a')
	})

	benchmark('Object.hasOwnProperty', function() {
		hasOwnProp(obj, 'a')
	})
})

suite('observer: Equal', function() {
	const a = {},
		b = {}
	const p1 = observer({}).proxy
	const p2 = observer({}).proxy

	benchmark('observer.$eq', function() {
		return $eq(a, b)
	})

	benchmark('observer.$eq by proxy', function() {
		return $eq(p1, p2)
	})

	benchmark('native compare', function() {
		return a === b
	})
})

suite('observer: proxy', function() {
	const a = {}
	const obs = observer(a)
	benchmark('proxy(by source)', function() {
		return proxy(a)
	})

	const p = obs.proxy
	benchmark('proxy(by proxy)', function() {
		return proxy(p)
	})
})

suite('observer: source', function() {
	const a = {}
	const obs = observer(a)
	benchmark('source(by source)', function() {
		return source(a)
	})

	const p = obs.proxy
	benchmark('source(by proxy)', function() {
		return source(p)
	})
})

function observePerf(title, path, nextObj) {
	benchmark(title, function() {
		let data = nextObj()
		observe(data.obj, path, data.fn)
	})
}

function unobservePerf(title, path, nextObj) {
	benchmark(title, function() {
		let data = nextObj()
		observe(data.obj, path, data.fn)
		unobserve(data.obj, path, data.fn)
	})
}

function objBuilder(path, sameObj, fn) {
	path = parsePath(path)
	fn = fn || function() {}
	let last = path.length - 1,
		builder
	if (path[last] === 'length' || path[last] === 'change') {
		builder = last
			? function() {
					let obj = {},
						i = 0,
						tmp = obj
					for (; i < last - 1; i++) {
						tmp = tmp[path[i]] = {}
					}
					tmp[path[i]] = []
					return {
						obj,
						fn
					}
			  }
			: function() {
					return {
						obj: [],
						fn
					}
			  }
	} else {
		builder = function() {
			let obj = {},
				i = 0,
				tmp = obj
			for (; i < last; i++) {
				tmp = tmp[path[i]] = {}
			}
			tmp[path[i]] = 1
			return {
				obj,
				fn
			}
		}
	}
	if (!sameObj) return builder
	let o = builder()
	return function() {
		return o
	}
}

function buildPath(level) {
	let paths = [],
		path = [],
		i = 0
	for (; i < level; i++) path[i] = 'test'

	paths.push(path.join('.'))

	path[path.length - 1] = 'length'
	//paths.push(path.join('.'))

	path[path.length - 1] = 'change'
	//paths.push(path.join('.'))
	return paths
}

function bechPath(level, bench, sameObj) {
	let title = bench === observePerf ? 'observe' : 'observe & unobserve'
	let paths = buildPath(level)

	suite(`${title}: path[${level}] (${sameObj ? 'same' : 'diff'} object)`, function() {
		for (let i = 0, p, t; i < paths.length; i++) {
			p = parsePath(paths[i])
				.slice()
				.pop()
			t = `${p === 'length' ? 'Array.length' : p === 'change' ? 'Array.change' : 'Object'}[${paths[i]}]`
			bench(t, paths[i], objBuilder(paths[i], sameObj))
		}
	})
}

function watchBench(attrNum) {
	const attrs = new Array(attrNum)
	for (let i = 0; i < attrNum; i++) attrs[i] = 'attr' + i

	suite(`Proxy vs defineProperty${attrNum > 1 ? ' ' + attrNum + ' attributes' : ''}`, function() {
		benchmark('Proxy', function() {
			const obj = createObj()
			new Proxy(obj, {
				get: (source, attr, proxy) => {
					return source[attr]
				},
				set: (source, attr, value, proxy) => {
					source[attr] = value
				}
			})
		})

		benchmark('Object.defineProperty', function() {
			const obj = createObj()
			for (let i = 0; i < attrNum; i++) defineProp(obj, attrs[i])
		})
	})

	const defineProperty = Object.defineProperty

	function defineProp(obj, attr) {
		let value = obj[attr]
		defineProperty(obj, attr, {
			enumerable: true,
			configurable: true,
			get() {
				return value
			},
			set(newValue) {
				value = newValue
			}
		})
	}

	function createObj() {
		const obj = {}
		for (let i = 0; i < attrNum; i++) {
			obj['attr' + i] = 1
		}
		return obj
	}
}
