import * as _ from '../class'

describe("class", () => {

  it('class', () => {
    let root = _.dynamicClass({
        constructor(val) {
          this.val = val
        },
        value() {
          return this.val
        }
      }),
      parent = _.dynamicClass({
        extend: root,
        constructor(val, val2) {
          this.super([val])
          this.val2 = val2
          expect(this.superclass()).to.equal(root)
        },
        value() {
          expect(this.super()).to.equal(this.val)
          return this.val2
        }
      }),
      child = _.dynamicClass({
        extend: parent,
        constructor() {
          expect(this.superclass()).to.equal(parent)
          this.super(arguments)
        }
      }),
      class4 = _.dynamicClass({
        statics: {
          a: 1
        }
      })

    expect(_.isExtendOf(parent, Object)).to.equal(true)
    expect(_.isExtendOf(parent, root)).to.equal(true)
    expect(_.isExtendOf(child, Object)).to.equal(true)
    expect(_.isExtendOf(child, parent)).to.equal(true)
    expect(_.isExtendOf(child, root)).to.equal(true)
    expect(_.isExtendOf(child, class4)).to.equal(false)
    expect(class4.a).to.equal(1)

    let c = new child(1, 2)
    expect(_.isExtendOf(c, parent)).to.equal(true)
    expect(_.isExtendOf(c, root)).to.equal(true)
    expect(_.isExtendOf(c, Object)).to.equal(true)
    expect(_.isExtendOf(c, class4)).to.equal(false)

  })
})
