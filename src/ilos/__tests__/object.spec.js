import {
  hasOwnProp
} from '../common'
import * as _ from '../object'
describe("object", () => {

  it('keys', () => {
    expect(_.keys({
      a: 1,
      b: {
        a: 1
      }
    })).to.eql(['a', 'b'])
  })

  it('values', () => {
    expect(_.values({
      a: 1,
      b: {
        a: 1
      }
    })).to.eql([1, {
      a: 1
    }])
  })

  it('parseExpr', () => {
    expect(_.parseExpr('a.b.c')).to.eql(['a', 'b', 'c'])
    expect(_.parseExpr('a["b"].c')).to.eql(['a', 'b', 'c'])
  })

  it('get & set & has', () => {
    let o = {
      a: {
        b: [1, 2, 3]
      }
    }
    expect(_.get(o, 'a.b[0]')).to.equal(1)
    expect(_.get(o, 'a.b[1]')).to.equal(2)

    expect(_.has(o, 'a.b[0]')).to.equal(true)
    expect(_.has(o, 'a.b[4]')).to.equal(false)

    _.set(o, 'a.b[0]', 2)
    expect(o.a.b[0]).to.equal(2)
    expect(_.get(o, 'a.b[0]')).to.equal(2)
  })

  it('prototypeOf', () => {
    let o = {},
      fn = function() {}

    _.setPrototypeOf(o, fn)
    expect(_.prototypeOf(o)).to.equal(fn)
  })

  it('assign', () => {

    expect(_.assign({
      a: 1
    }, {
      a: 2,
      b: 3
    })).to.eql({
      a: 2,
      b: 3
    })

    expect(_.assignIf({
      a: 1
    }, {
      a: 2,
      b: 3
    })).to.eql({
      a: 1,
      b: 3
    })
  })

  it('create', () => {
    let o = {
        a: 1
      },
      o2 = _.create(o)

    expect(o2.a).to.equal(1)
    expect(hasOwnProp(o2, 'a')).to.equal(false)

    o2.a = 2
    expect(o.a).to.equal(1)
  })
})
