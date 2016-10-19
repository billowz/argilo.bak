import {
  hump,
  YieId
} from '../util'

describe("Util", () => {
  it("hump", () => {
    expect(hump('abc')).equal('Abc')
    expect(hump('Abc')).equal('Abc')
    expect(hump('abc_abc')).equal('AbcAbc')
    expect(hump('abc-abc')).equal('AbcAbc')
    expect(hump('abc-_abc')).equal('AbcAbc')
    expect(hump('abc_abc_abc')).equal('AbcAbcAbc')
    expect(hump('abc-abc_abc')).equal('AbcAbcAbc')
    expect(hump('abc-abc-abc')).equal('AbcAbcAbc')
    expect(hump('abc_-abc-__abc')).equal('AbcAbcAbc')
  })

  it("YieId", (done) => {
    let doned = [0, 0],
      yieId = new YieId()

    expect(yieId.isDone()).equal(false)
    yieId.then(() => {
      expect(yieId.isDone()).equal(true)
      doned[0]++
    })
    yieId.done()
    expect(yieId.isDone()).equal(true)


    yieId = new YieId()
    yieId.done()
    expect(yieId.isDone()).equal(true)
    yieId.then(() => {
      expect(yieId.isDone()).equal(true)
      doned[1]++;
      expect(doned).to.eql([1, 1])
      done()
    })
  })
})
