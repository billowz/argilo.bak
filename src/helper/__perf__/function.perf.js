import { apply, applyScope, applyNoScope, applyN, applyScopeN, applyNoScopeN, createFn } from '../function'

bench(undefined, 0)
bench({}, 0)

bench(undefined, 5)
bench({}, 5)

bench(undefined, 8)
bench({}, 8)

bench(undefined, 10)
bench({}, 10)

function bench(scope, argLen) {
	const fn = fnBuilder(argLen)()
	const args = new Array(argLen)
	let i
	for (i = 0; i < argLen; i++) args[i] = i + 1

	const tokens = new Array(argLen)
	for (i = 0; i < argLen; i++) tokens[i] = `args[${i}]`

	const call = createFn(
		['fn', 'scope', 'args'],
		`
        fn.call(scope${tokens.length ? ',' + tokens.join(',') : ''})
    `
	)

	const execute = createFn(
		['fn', 'args'],
		`
        fn(${tokens.join(',')})
    `
	)

	suite(`call function ${scope ? 'with' : 'without'} scope by x${argLen} argument${argLen > 1 ? 's' : ''}`, function() {
		benchmark('argilo.apply', function() {
			apply(fn, scope, args)
		})
		benchmark('argilo.applyN', function() {
			applyN(fn, scope, args, 0, args.length)
		})
		if (scope) {
			benchmark('argilo.applyScope', function() {
				applyScope(fn, scope, args)
			})
			benchmark('argilo.applyScopeN', function() {
				applyScopeN(fn, scope, args, 0, args.length)
			})
		} else {
			benchmark('argilo.applyNoScope', function() {
				applyNoScope(fn, args)
			})
			benchmark('argilo.applyNoScopeN', function() {
				applyNoScopeN(fn, scope, args, 0, args.length)
			})
		}
		benchmark('Function.apply', function() {
			fn.apply(scope, args)
		})
		benchmark('Function.call', function() {
			call(fn, scope, args)
		})
		if (!scope) {
			benchmark('execute', function() {
				execute(fn, args)
			})
		}
	})
}

function fnBuilder(argLen) {
	const tokens = new Array(argLen)
	while (argLen--) tokens[argLen] = 'a' + argLen
	return createFn(`
    return function(${tokens.join(', ')}){
      return ${tokens.join(' + ')} + 1
    }
`)
}
