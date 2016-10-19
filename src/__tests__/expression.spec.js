import expression from '../expression'
import _ from 'ilos'
import logger from '../log'

const testCases = [{
    // simple path
    exp: 'a.b.d',
    scope: {
      a: {
        b: {
          d: 123
        }
      }
    },
    expected: 123
  },
  // complex path
  {
    exp: 'a["b"].c',
    scope: {
      a: {
        b: {
          c: 234
        }
      }
    },
    expected: 234
  }, {
    // string concat
    exp: 'a+b',
    scope: {
      a: 'hello',
      b: 'world'
    },
    expected: 'helloworld'
  }, {
    // math
    exp: 'a - b * 2 + 45',
    scope: {
      a: 100,
      b: 23
    },
    expected: 100 - 23 * 2 + 45
  }, {
    // boolean logic
    exp: '(a && b) ? c : d || e',
    scope: {
      a: true,
      b: false,
      c: null,
      d: false,
      e: 'worked'
    },
    expected: 'worked'
  }, {
    // inline string with newline
    exp: "a + 'hel\nlo'",
    scope: {
      a: 'inline '
    },
    expected: 'inline hel\nlo'
  }, {
    // multiline expressions
    exp: "{\n a: '35',\n b: c}",
    scope: {
      c: 32
    },
    expected: {
      a: '35',
      b: 32
    }
  }, {
    // Object with string values with back-quotes
    exp: '[{"a":"he`llo"},{"b":"world"},{"c":55}]',
    scope: {},
    expected: [{
      'a': 'he`llo'
    }, {
      'b': 'world'
    }, {
      'c': 55
    }]
  }, {
    // Object with string values and back quotes (single quoted string)
    exp: '[{\'a\':\'he`llo\'},{\'b\':\'world\'},{\'c\':55}]',
    scope: {},
    expected: [{
      'a': 'he`llo'
    }, {
      'b': 'world'
    }, {
      'c': 55
    }]
  }, {
    // dollar signs and underscore
    exp: "_a + ' ' + $b",
    scope: {
      _a: 'underscore',
      $b: 'dollar'
    },
    expected: 'underscore dollar'
  }, {
    // complex with nested values
    exp: "todo.title + ' : ' + (todo['done'] ? 'yep' : 'nope')",
    scope: {
      todo: {
        title: 'write tests',
        done: false
      }
    },
    expected: 'write tests : nope'
  }, {
    // expression with no data variables
    exp: "'a' + 'b'",
    scope: {},
    expected: 'ab',
    paths: []
  }, {
    // values with same variable name inside strings
    exp: "'\"test\"' + test + \"'hi'\" + hi",
    scope: {
      test: 1,
      hi: 2
    },
    expected: '"test"1\'hi\'2'
  }, {
    // expressions with inline object literals
    exp: "sortRows({ column: 'name', test: foo, durrr: 123 })",
    scope: {
      sortRows: function(params) {
        return params.column + params.test + params.durrr
      },
      foo: 'bar'
    },
    expected: 'namebar123'
  }, {
    // space between path segments
    exp: '  a    .   b    .  c + d',
    scope: {
      a: {
        b: {
          c: 12
        }
      },
      d: 3
    },
    expected: 15
  }, {
    // space in bracket identifiers
    exp: ' a[ " a.b.c " ] + b  [ \' e \' ]',
    scope: {
      a: {
        ' a.b.c ': 123
      },
      b: {
        ' e ': 234
      }
    },
    expected: 357
  }, {
    // number literal
    exp: 'a * 1e2 + 1.1',
    scope: {
      a: 3
    },
    expected: 301.1
  }, {
    // keyowrd + keyword literal
    exp: 'true && a["true"]',
    scope: {
      a: {
        'true': false
      }
    },
    expected: false
  }, {
    // super complex
    exp: ' $a + b[ "  a.b.c  " ][\'123\'].$e&&c[ " d " ].e + Math.round(e) ',
    scope: {
      $a: 1,
      b: {
        '  a.b.c  ': {
          '123': {
            $e: 2
          }
        }
      },
      c: {
        ' d ': {
          e: 3
        }
      },
      e: 4.5
    },
    expected: 8
  }, {
    // string with escaped quotes
    exp: "'a\\'b' + c",
    scope: {
      c: '\'c'
    },
    expected: "a'b'c"
  }, {
    // dynamic sub path
    exp: "a['b' + i + 'c']",
    scope: {
      i: 0,
      a: {
        'b0c': 123
      }
    },
    expected: 123
  }, {
    // Math global, simple path
    exp: 'Math.PI',
    scope: {},
    expected: Math.PI
  }, {
    // Math global, exp
    exp: 'Math.sin(a)',
    scope: {
      a: 1
    },
    expected: Math.sin(1)
  }, {
    // boolean literal
    exp: 'true',
    scope: {
      true: false
    },
    expected: true
  }, {
    exp: 'null',
    scope: {},
    expected: null
  }, {
    exp: 'undefined',
    scope: {
      undefined: 1
    },
    expected: undefined
  }, {
    // Date global
    exp: 'Date.now() > new Date(1000000000000) ',
    scope: {},
    expected: true
  },
  // typeof operator
  {
    exp: 'typeof test === "string"',
    scope: {
      test: '123'
    },
    expected: true
  },
  // isNaN
  {
    exp: 'isNaN(a)',
    scope: {
      a: 2
    },
    expected: false
  },
  // parseFloat & parseInt
  {
    exp: 'parseInt(a, 10) + parseFloat(b)',
    scope: {
      a: 2.33,
      b: '3.45'
    },
    expected: 5.45
  }, {
    exp: 'this.parseInt(a, 10) + parseFloat(b)',
    scope: {
      a: 2.33,
      b: '3.45',
      parseInt(a) {
        return parseInt.apply(null, arguments) + 1
      }
    },
    expected: 6.45
  }, {
    exp: 'this["true"]',
    scope: {
      true: 1
    },
    expected: 1
  }, {
    exp: 'a = 1',
    scope: {
      a: 0
    },
    expected: 1,
    expect(scope, ret) {
      expect(scope.a).equal(1)
    }
  }, {
    exp: 'a.b.c = 1',
    scope: {
      a: {
        b: {
          c: 0
        }
      }
    },
    expected: 1,
    expect(scope, ret) {
      expect(scope.a.b.c).equal(1)
    }
  }, {
    exp: 'a.b[0].c = 1',
    scope: {
      a: {
        b: [{
          c: 0
        }]
      }
    },
    expected: 1,
    expect(scope, ret) {
      expect(scope.a.b[0].c).equal(1)
    }
  }, {
    exp: 'a += 1',
    scope: {
      a: 0
    },
    expected: 1,
    expect(scope, ret) {
      expect(scope.a).equal(1)
    }
  }, {
    exp: 'a -= 1',
    scope: {
      a: 0
    },
    expected: -1,
    expect(scope, ret) {
      expect(scope.a).equal(-1)
    }
  }, {
    exp: 'a *= 2',
    scope: {
      a: 1
    },
    expected: 2,
    expect(scope, ret) {
      expect(scope.a).equal(2)
    }
  }, {
    exp: 'a /= 2',
    scope: {
      a: 1
    },
    expected: 0.5,
    expect(scope, ret) {
      expect(scope.a).equal(0.5)
    }
  }, {
    exp: 'a &= 0',
    scope: {
      a: 1
    },
    expected: 0,
    expect(scope, ret) {
      expect(scope.a).equal(0)
    }
  }, {
    exp: 'a <<= 1',
    scope: {
      a: 1
    },
    expected: 2,
    expect(scope, ret) {
      expect(scope.a).equal(2)
    }
  }, {
    exp: 'a >>= 1',
    scope: {
      a: 2
    },
    expected: 1,
    expect(scope, ret) {
      expect(scope.a).equal(1)
    }
  }, {
    exp: 'a|plural',
    scope: {
      a: 'test'
    },
    expected: 'tests'
  }, {
    exp: 'a|singular',
    scope: {
      a: 'tests'
    },
    expected: 'test'
  }, {
    exp: 'a|format "%3$.2f, %2$5d, %$1s", 123, 1231.123',
    scope: {
      a: 'tests'
    },
    expected: '1231.12, 00123, tests'
  }, {
    exp: 'json|json',
    scope: {
      json: {
        a: 1
      }
    },
    expected: '{\n  \"a\": 1\n}'
  }, {
    exp: 'str|trim',
    scope: {
      str: '   test   '
    },
    expected: 'test'
  }, {
    exp: 'str|capitalize',
    scope: {
      str: 'test'
    },
    expected: 'Test'
  }, {
    exp: 'str|uppercase',
    scope: {
      str: 'aaAa'
    },
    expected: 'AAAA'
  }, {
    exp: 'str|lowercase',
    scope: {
      str: 'AAaA'
    },
    expected: 'aaaa'
  }, {
    exp: 'str| unit "item","%s %s"',
    scope: {
      str: 1123
    },
    expected: '1123 items'
  }
]

describe('Expression Parser', () => {
  _.each(testCases, (testCase) => {
    it('parse expression: ' + testCase.exp, () => {
      let exp = expression(testCase.exp, ['$scope', '$testCase'], (expr, realScope) => {
        return realScope ? '$scope' : 'this'
      })
      logger.info(testCase.exp, '\n', exp.executor.toString())
      _.each(exp.filters, f => {
        logger.info(f.name, ':', _.map(f.argExecutors, e => e.toString()))
      })
      ret = exp.executeAll(testCase.scope, [testCase.scope, testCase])
      logger.info(ret)
      expect(ret).to.eql(testCase.expected)
      if (_.isFunc(testCase.expect)) {
        testCase.expect(testCase.scope, ret)
      }
    })
  })
})
