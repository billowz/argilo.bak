import { parsePath } from '../propPath'

suite('path.parsePath(cache disabled)', function() {
	benchmark('path.parsePath', function() {
		parsePath('a.b[0].c', false)
	})
})

suite('path.parsePath(cache enabled)', function() {
	benchmark('path.parsePath', function() {
		parsePath('a.b[0].c')
	})
})

suite('path.parsePath(random path & cache disabled)', function() {
	let i = 0
	benchmark('path.parsePath', function() {
		parsePath('a.b[' + (i++ % 1000) + '].c', false)
	})
})

suite('path.parsePath(random path & cache enabled)', function() {
	let i = 0
	benchmark('path.parsePath', function() {
		parsePath('a.b[' + (i++ % 1000) + '].c')
	})
})
