import { hasOwnProp } from '../ownProp'
import { prototypeOf, setPrototypeOf } from '../prototypeOf'
import create from '../create'
import { inherit, superCls, subclassOf } from '../inherit'
import { extend, extendIf, extendBy } from '../extend'
import createClass from '../class'

describe('Prototype', () => {
	it('prototypeOf', function() {
		expect(prototypeOf({})).to.equal(Object.prototype)
		expect(prototypeOf(new Object())).to.equal(Object.prototype)

		function A() {}

		expect(prototypeOf(A)).to.equal(Function.prototype)
		expect(prototypeOf(new A())).to.equal(A.prototype)
	})

	it('setPrototypeOf & prototypeOf', function() {
		const a = {},
			b = {}

		function A() {}

		expect(prototypeOf(A)).to.equal(Function.prototype)

		setPrototypeOf(a, b)
		setPrototypeOf(A, b)

		expect(prototypeOf(a)).to.equal(b)
		expect(prototypeOf(A)).to.equal(b)
		expect(prototypeOf(new A())).to.equal(A.prototype)
	})

	it('create', () => {
		const o = { a: 1 },
			o2 = create(o, { b: { value: 123 } })

		expect(o2.a).to.equal(1)
		expect(hasOwnProp(o2, 'a')).to.equal(false)
		expect(o2.b).to.equal(123)
		expect(prototypeOf(o2)).to.equal(o)
		o2.a = 2
		expect(o.a).to.equal(1)

		function A() {}

		function B() {}
		B.prototype = create(A.prototype, { constructor: { value: B } })

		expect(new B().constructor).to.equal(B)
		expect(prototypeOf(new B())).to.equal(B.prototype)
	})

	it('constructor', function() {
		const a = {}

		function A() {}

		function B() {}
		B.prototype = create(A.prototype, { constructor: { value: B } })

		expect(a.constructor).to.equal(Object)
		expect(A.prototype.constructor).to.equal(A)
		expect(A.constructor).to.equal(Function)
		expect(B.constructor).to.equal(Function)
		expect(new A().constructor).to.equal(A)
		expect(new B().constructor).to.equal(B)
	})

	it('extend & extendIf', function() {
		function A() {}
		extend(A, { a: 1 })
		expect(A.prototype.a).to.equal(1)

		extend(A, { a: 2 })
		expect(A.prototype.a).to.equal(2)

		extendBy(A, v => true, { a: 3 })
		expect(A.prototype.a).to.equal(3)

		extendBy(A, v => false, { a: 4 })
		expect(A.prototype.a).to.equal(3)

		extendIf(A, { a: 5, b: 6 })
		expect(A.prototype.a).to.equal(3)
		expect(A.prototype.b).to.equal(6)
	})

	it('inherit', function() {
		function A() {}

		function B() {}

		function C() {}

		inherit(B, A)
		inherit(C, B)

		checkCls(A)
		checkCls(B, [A])
		checkCls(C, [B, A])
	})

	it('createClass', function() {
		const A = createClass({
			name: 'AAA',
			statics: {
				a: 1,
			},
			prototype: {
				c: 2,
				d: 1,
			},
			b: 1,
			c: 1,
		})
		checkCls(A)

		expect(A.a).to.equal(1)
		expect(A.prototype.b).to.equal(1)
		expect(A.prototype.c).to.equal(2)
		expect(A.prototype.d).to.equal(1)
		expect(A.prototype.name).to.equal(undefined)
		expect(A.prototype.statics).to.equal(undefined)
		expect(A.prototype.extend).to.equal(undefined)
		expect(A.prototype.prototype).to.equal(undefined)

		const B = createClass({
			name: 'BBB',
			extend: A,
			constructor() {
				this.e = 1
			},
			prototype: {
				name: 'xxx',
				statics: 'xxx',
				extend: 'xxx',
				prototype: 'xxx',
			},
		})

		checkCls(B, [A])
		expect(B.prototype.name).to.equal('xxx')
		expect(B.prototype.statics).to.equal('xxx')
		expect(B.prototype.extend).to.equal('xxx')
		expect(B.prototype.prototype).to.equal('xxx')
		expect(new B().e).to.equal(1)

		const C = createClass({
			extend: B,
		})
		checkCls(C, [B, A])
		expect(new C().e).to.equal(1)

		const D = createClass({
			extend: C,
			constructor() {
				this.e = 2
			},
		})
		checkCls(D, [C, B, A])
		expect(new D().e).to.equal(2)

		if (T.name === 'T') {
			expect(A.name).to.equal('AAA')
			expect(B.name).to.equal('BBB')
		}

		function T() {}
	})
})

function checkCls(cls, supers = []) {
	let i = 0,
		tmp = cls

	expect(cls.prototype.constructor).to.equal(cls)
	expect(prototypeOf(cls)).to.equal(supers[0] || Function.prototype)

	while ((tmp = superCls(tmp))) {
		expect(tmp).to.equal(supers[i])
		expect(subclassOf(cls, supers[i])).to.equal(true)
		i++
	}
	expect(i).to.equal(supers.length)

	const inst = new cls()

	expect(inst instanceof cls).to.equal(true)
	for (i = 0; i < supers.length; i++) expect(inst instanceof supers[i]).to.equal(true)

	expect(inst.constructor).to.equal(cls)
	expect(prototypeOf(inst)).to.equal(cls.prototype)
}
