import * as _ from '../string'

describe("string", () => {

  it('upperFirst', () => {
    expect(_.upperFirst('abc')).to.equal('Abc')
  })

  it('trim', () => {
    expect(_.ltrim(' ab c ')).to.equal('ab c ')
    expect(_.rtrim(' ab c ')).to.equal(' ab c')
    expect(_.trim(' ab c ')).to.equal('ab c')
  })

  it('thousandSeparate', () => {
    expect(_.thousandSeparate(100000)).to.equal('100,000')
    expect(_.thousandSeparate(100000.234)).to.equal('100,000.234')
  })

  it('format', () => {
    expect(_.format('%s %d', 'abc', 1)).to.equal('abc 1')
    expect(_.format('%s %5d', 'abc', 1)).to.equal('abc 00001')
    expect(_.format('%s %,.2f', 'abc', 10000)).to.equal('abc 10,000.00')
    expect(_.format('%1$s %2$d', 'abc', 1)).to.equal('abc 1')
  })
})
