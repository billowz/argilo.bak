import { assert } from '..'

describe('assert', function() {
	it('assert', function() {
		try {
			assert('test error.')
			throw new Error(`assert() expect to throw Error("test error.")`)
		} catch (e) {
			if ('test error.' !== e.message) {
				throw new Error(`assert() expect error message "${e.message} to "test error."`)
			}
		}
	})
	it('assert.is', function() {
		noerr('is', [1])
		err('is', [0], `expected 0 to exist`)
	})
	it('assert.not', function() {
		noerr('not', [0])
		err('not', [1], `expected 1 not to exist`)
	})
	it('assert.throw', function() {
		noerr('throw', [
			() => {
				throw new Error('error')
			}
		])
		noerr('throw', [
			() => {
				throw new Error('error')
			},
			'error'
		])
		noerr('throw', [
			() => {
				throw new Error('error')
			},
			new Error('error')
		])
		err('throw', [() => true], `expected catched error undefined is ${new Error()}`)
		err(
			'throw',
			[
				() => {
					throw new Error('error')
				},
				'error2'
			],
			`expected catched error ${new Error('error')} is error2`
		)
		err(
			'throw',
			[
				() => {
					throw new Error('error')
				},
				new Error('error2')
			],
			`expected catched error ${new Error('error')} is ${new Error('error2')}`
		)
	})
	it('assert.notThrow', function() {
		noerr('notThrow', [() => true])
		noerr('notThrow', [
			() => {
				throw new Error('error')
			},
			'error2'
		])
		noerr('notThrow', [
			() => {
				throw new Error('error')
			},
			new Error('error2')
		])

		err(
			'notThrow',
			[
				() => {
					throw new Error('error')
				}
			],
			`expected catched error ${new Error('error')} is not undefined`
		)
		err(
			'notThrow',
			[
				() => {
					throw new Error('error')
				},
				'error'
			],
			`expected catched error ${new Error('error')} is not error`
		)
		err(
			'notThrow',
			[
				() => {
					throw new Error('error')
				},
				new Error('error')
			],
			`expected catched error ${new Error('error')} is not ${new Error('error')}`
		)
	})
})

function err(method: string, args: any[], msg?: string) {
	try {
		assert[method].apply(assert, args)
		throw new Error(`assert.${method}: expect to throw Error("${msg}")`)
	} catch (e) {
		if (msg && msg !== e.message) {
			throw new Error(`assert.${method}: expect message "${e.message}" to "${msg}"`)
		}
	}
}

function noerr(method: string, args: any[]) {
	try {
		assert[method].apply(assert, args)
	} catch (e) {
		console.log(e)
		throw new Error(`assert.${method}: expect not to throw Error("${e.message}")`)
	}
}
