import Configuration from '../Configuration'

describe("Configuration", () => {
  it("Configuration", () => {
    let config = new Configuration()

    config.register('test0', 0)
    config.register('test1', 1)
    config.register('test2', 2)

    config.config({
      test0: undefined,
      test1: 2,
      test3: 3
    })
    expect(config.get('test0')).equal(undefined)
    expect(config.get('test1')).equal(2)
    expect(config.get('test2')).equal(2)
    expect(config.get('test3')).equal(undefined)

    let cfg = config.get()
    expect(cfg.test0).equal(undefined)
    expect(cfg.test1).equal(2)
    expect(cfg.test2).equal(2)
    expect(cfg.test3).equal(undefined)
    cfg.test0 = 1
    expect(config.get('test0')).equal(undefined)
  })
})
