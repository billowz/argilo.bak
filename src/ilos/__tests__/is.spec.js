import * as _ from '../is'

describe("is", () => {

  it("isDefine", () => {
    expect(_.isDefine(null)).to.equal(true)
    expect(_.isDefine(undefined)).to.equal(false)
  })

  it("isNull", () => {
    expect(_.isNull(null)).to.equal(true)
    expect(_.isNull(undefined)).to.equal(false)

  })

  it("isNil", () => {
    expect(_.isNil(null)).to.equal(true)
    expect(_.isNil(undefined)).to.equal(true)
    expect(_.isNil(0)).to.equal(false)
  })

  it("isFunc", () => {
    expect(_.isFunc(() => {})).to.equal(true)
  })

  it("isNumber", () => {
    expect(_.isNumber(0)).to.equal(true)
    expect(_.isNumber(NaN)).to.equal(true)
    expect(_.isNumber('0')).to.equal(false)
  })

  it("isBool", () => {
    expect(_.isBool(true)).to.equal(true)
    expect(_.isBool('')).to.equal(false)

  })

  it("isDate", () => {
    expect(_.isDate(new Date())).to.equal(true)
  })

  it("isString", () => {
    expect(_.isString('')).to.equal(true)
  })

  it("isObject", () => {
    expect(_.isObject({})).to.equal(true)
    expect(_.isObject(Object)).to.equal(false)
  })

  it("isRegExp", () => {
    expect(_.isRegExp(/^a/)).to.equal(true)
  })

  it("isArray", () => {
    expect(_.isArray([])).to.equal(true)

    function arg() {
      expect(_.isArray(arguments)).to.equal(false)
    }
    arg()
  })

  it("isArrayLike", () => {
    expect(_.isArrayLike([])).to.equal(true)

    function arg() {
      expect(_.isArrayLike(arguments)).to.equal(true)
    }
    arg()
  })
})
