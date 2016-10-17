import observi from '../index'
import _ from 'ilos'


function test(name, obj, path, steps, done) {
  const logger = new _.Logger(name, 'debug')
  let step = 0

  function watchVal(step) {
    return 'watch' in step ? step.watch : step.val
  }

  function handler(path2, val, oldVal, o, eq) {
    let _oldVal = watchVal(steps[step - 1]),
      _val = watchVal(steps[step])


    logger.debug('step[%s]: handler %s(%s) %s(%s) to %s(%s) %s(%s)', step, path, path2, oldVal, _oldVal, val, _val, _oldVal === _val, eq)
    expect(path).equal(path2)
    expect(_val).equal(observi.obj(val))
    expect(_oldVal).equal(observi.obj(oldVal))
    expect(observi.obj(obj)).equal(observi.obj(o))
    expect(eq).equal(_oldVal === _val)

    if (!steps[step + 1]) {
      logger.debug('test end')
      observi.un(obj, path, handler)
      expect(observi.isListened(obj, path, handler)).equal(false)
      done()
    } else {
      setTimeout(update, 0)
    }
  }
  obj = observi.on(obj, path, handler)

  expect(observi.isListened(obj, path, handler)).equal(true)


  function update() {
    let oldVal = _.get(obj, path),
      desc = steps[++step]
    var o2 = obj
    logger.debug('step[%s]: ', step)
    _.set(obj, desc.path || path, desc.val)
    logger.debug('step[%s]: updated path[%s = %s] %s to %s', step, desc.path || path, desc.val, oldVal, _.get(obj, path), desc.val)
  }

  update()
}

describe("observi", () => {
  it('simple property', (done) => {
    let arr = []
    test('spec-simple-property', {}, 'prop', [{
      val: undefined
    }, {
      val: 'abc'
    }, {
      val: 123
    }, {
      val: arr
    }, {
      val: arr
    }, {
      val: new Date()
    }, {
      val: undefined
    }], done)
  })

  it("path property", function(done) {
    test('spec-path-property', {}, 'obj.array[0].prop', [{
      val: undefined
    }, {
      path: 'obj',
      val: {
        array: [{
          prop: '123'
        }]
      },
      watch: '123'
    }, {
      path: 'obj',
      val: {
        array: [{
          prop: 123
        }]
      },
      watch: 123
    }, {
      path: 'obj.array[0]',
      val: {
        prop: 'abc'
      },
      watch: 'abc'
    }, {
      path: 'obj.array',
      val: [{
        prop: null
      }],
      watch: null
    }, {
      path: 'obj',
      val: null,
      watch: undefined
    }], done)
  })
})
