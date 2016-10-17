import * as _ from '../collection'

describe("collection", () => {
  let arr = [1, 2, 3],
    obj = {
      0: 1,
      1: 2,
      2: 3
    }

  it('each', () => {
    let rs = {}
    _.each(arr, (val, idx) => {
      rs[idx] = val
    })
    expect(rs).to.eql(obj)
    rs = {}
    _.each(obj, (val, idx) => {
      rs[idx] = val
    })
    expect(rs).to.eql(obj)
  })

  it('map', () => {
    expect(_.map(arr, (val) => val + 1)).to.eql([2, 3, 4])
    expect(_.map(obj, (val) => val + 1)).to.eql({
      0: 2,
      1: 3,
      2: 4
    })
  })

  it('filter', () => {
    expect(_.filter(arr, (val) => val - 1)).to.eql([2, 3])
    expect(_.filter(obj, (val) => val - 1)).to.eql({
      1: 2,
      2: 3
    })
  })

  it('aggregate', () => {
    expect(_.aggregate(arr, (rs, val) => rs + val, 0)).to.equal(6)
    expect(_.aggregate(obj, (rs, val) => rs + val, 0)).to.equal(6)
  })

  it('indexof', () => {
    expect(_.indexOf(arr, 2)).to.equal(1)
    expect(_.indexOf(obj, 2)).to.equal('1')
  })

  it('indexof', () => {
    expect(_.lastIndexOf(arr, 2)).to.equal(1)
    expect(_.lastIndexOf(obj, 2)).to.equal('1')
  })

  it('convert', () => {
    expect(_.convert(arr, (v, k) => k + 1, (v) => v + 1)).to.eql({
      1: 2,
      2: 3,
      3: 4
    })
    expect(_.convert(obj, (v, k) => parseInt(k) + 1, (v) => v + 1)).to.eql({
      1: 2,
      2: 3,
      3: 4
    })
  })
  it('reverseConvert', () => {
    expect(_.reverseConvert(arr, (v, k) => k)).to.eql({
      1: 0,
      2: 1,
      3: 2
    })
    expect(_.reverseConvert(obj, (v, k) => k)).to.eql({
      1: 0,
      2: 1,
      3: 2
    })
  })
})
