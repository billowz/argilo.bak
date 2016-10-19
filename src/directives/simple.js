import {
  Directive
} from '../binding'
import expression from '../expression'
import _ from 'ilos'
import {
  hump,
  YieId
} from '../util'
import dom from '../dom'
import logger from '../log'

const expressionArgs = ['$scope', '$el', '$tpl', '$binding']

const SimpleDirective = _.dynamicClass({
  extend: Directive,
  constructor() {
    this.super(arguments)
    this.observeHandler = this.observeHandler.bind(this)
    this.expression = expression(this.expr, expressionArgs, this.expressionScopeProvider)
  },
  realValue() {
    let scope = this.scope()
    return this.expression.execute(scope, [scope, this.el, this.tpl, this])
  },
  value() {
    let scope = this.scope()
    return this.expression.executeAll(scope, [scope, this.el, this.tpl, this])
  },
  listen() {
    _.each(this.expression.identities, (ident) => {
      this.observe(ident, this.observeHandler)
    })
    this.update(this.value())
  },
  unlisten() {
    _.each(this.expression.identities, (ident) => {
      this.unobserve(ident, this.observeHandler)
    })
  },
  bind() {
    this.listen()
    this.super(arguments)
  },
  unbind() {
    this.super(arguments)
    this.unlisten()
  },
  blankValue(val) {
    if (arguments.length == 0) val = this.value()
    return _.isNil(val) ? '' : val
  },
  observeHandler(expr, val) {
    if (this.expression.isSimple()) {
      let scope = this.scope()
      this.update(this.expression.executeFilter(scope, [scope, this.el, this.tpl, this], val))
    } else {
      this.update(this.value())
    }
  },
  update(val) {
    throw `abstract method`
  }
})

const EVENT_CHANGE = 'change',
  EVENT_INPUT = 'input',
  EVENT_CLICK = 'click',
  TAG_SELECT = 'SELECT',
  TAG_INPUT = 'INPUT',
  TAG_TEXTAREA = 'TEXTAREA',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  directives = {
    text: {
      block: true,
      update(val) {
        dom.text(this.el, this.blankValue(val))
      }
    },
    html: {
      block: true,
      update(val) {
        dom.html(this.el, this.blankValue(val))
      }
    },
    'class': {
      update(value) {
        if (value && typeof value == 'string') {
          this.handleArray(_.trim(value).split(/\s+/))
        } else if (value instanceof Array) {
          this.handleArray(value)
        } else if (value && typeof value == 'object') {
          this.handleObject(value)
        } else {
          this.cleanup()
        }
      },
      handleObject(value) {
        this.cleanup(value, false)
        let keys = this.prevKeys = [],
          el = this.el
        for (let key in value) {
          if (value[key]) {
            dom.addClass(el, key)
            keys.push(key)
          } else {
            dom.removeClass(el, key)
          }
        }
      },
      handleArray(value) {
        this.cleanup(value, true)
        let keys = this.prevKeys = [],
          el = this.el
        _.each(value, (val) => {
          if (val) {
            keys.push(val)
            dom.addClass(el, val)
          }
        })
      },
      cleanup(value, isArr) {
        let prevKeys = this.prevKeys
        if (prevKeys) {
          let i = prevKeys.length,
            el = this.el
          while (i--) {
            let key = prevKeys[i]
            if (!value || (isArr ? _.indexOf(value, key) == -1 : !_.hasOwnProp(value, key))) {
              dom.removeClass(el, key)
            }
          }
        }
      }
    },
    'style': {
      update(value) {
        if (value && _.isString(value)) {
          dom.style(this.el, value)
        } else if (value && _.isObject(value)) {
          this.handleObject(value)
        }
      },
      handleObject(value) {
        this.cleanup(value)
        let keys = this.prevKeys = [],
          el = this.el
        _.each(value, (val, key) => {
          dom.css(el, key, val)
        })
      },
      cleanup(value) {
        let prevKeys = this.prevKeys
        if (prevKeys) {
          let i = prevKeys.length,
            el = this.el
          while (i--) {
            let key = prevKeys[i]
            if (!value || !_.hasOwnProp(value, key))
              dom.css(el, key, '')
          }
        }
      }
    },
    show: {
      update(val) {
        dom.css(this.el, 'display', val ? '' : 'none')
      }
    },
    hide: {
      update(val) {
        dom.css(this.el, 'display', val ? 'none' : '')
      }
    },
    value: {
      update(val) {
        dom.val(this.el, this.blankValue(val))
      }
    },
    'if': {
      priority: 9,
      bind() {
        this.yieId = new YieId()
        this.listen()
        return this.yieId
      },
      unbind() {
        if (!this.yieId)
          this.unbindChildren()
        this.unlisten()
      },
      update(val) {
        if (!val) {
          dom.css(this.el, 'display', 'none')
        } else {
          if (this.yieId) {
            this.yieId.done()
            this.yieId = undefined
            this.bindChildren()
          }
          dom.css(this.el, 'display', '')
        }
      }
    },
    checked: {
      update(val) {
        _.isArray(val) ? dom.checked(this.el, _.indexOf(val, dom.val(this.el))) : dom.checked(this.el, !!val)
      }
    },
    selected: {
      update(val) {}
    },
    focus: {
      update(val) {
        if (val) dom.focus(this.el)
      }
    },
    input: {
      priority: 4,
      constructor() {
        this.super(arguments)
        if (!this.expression.isSimple())
          throw TypeError(`Invalid Expression[${this.expression.expr}] on InputDirective`)

        this.onChange = this.onChange.bind(this)
        let tag = this.tag = this.el.tagName
        switch (tag) {
          case TAG_SELECT:
            this.event = EVENT_CHANGE
            break
          case TAG_INPUT:
            let type = this.type = this.el.type
            this.event = (type == RADIO || type == CHECKBOX) ? EVENT_CHANGE : EVENT_INPUT
            break
          case TAG_TEXTAREA:
            throw TypeError('Directive[input] not support ' + tag)
            break
          default:
            throw TypeError('Directive[input] not support ' + tag)
        }
      },

      bind() {
        dom.on(this.el, this.event, this.onChange)
        this.super()
      },

      unbind() {
        this.super()
        dom.off(this.el, this.event, this.onChange)
      },

      setRealValue(val) {
        this.set(this.expression.expr, val)
      },

      setValue(val) {
        let scope = this.scope()
        this.setRealValue(this.expression.restore(scope, [scope, this.el, this.tpl, this], val))
      },

      onChange(e) {
        let val = this.elVal(),
          idx,
          _val = this.val
        if (val != _val)
          this.setValue(val)
        e.stopPropagation()
      },

      update(val) {
        let _val = this.blankValue(val)
        if (_val != this.val)
          this.elVal((this.val = _val))
      },

      elVal(val) {
        let tag = this.tag

        switch (tag) {
          case TAG_SELECT:
            break
          case TAG_INPUT:
            let type = this.type

            if (type == RADIO || type == CHECKBOX) {
              if (arguments.length == 0) {
                return dom.checked(this.el) ? dom.val(this.el) : undefined
              } else {
                let checked

                checked = val == dom.val(this.el)
                if (dom.checked(this.el) != checked)
                  dom.checked(this.el, checked)
              }
            } else {
              if (arguments.length == 0) {
                return dom.val(this.el)
              } else if (val != dom.val(this.el)) {
                dom.val(this.el, val)
              }
            }
            break
          case TAG_TEXTAREA:
            throw TypeError('Directive[input] not support ' + tag)
            break
          default:
            throw TypeError('Directive[input] not support ' + tag)
        }
      }
    }
  }

export default _.assign(_.convert(directives, (opt, name) => {
  return hump(name + 'Directive')
}, (opt, name) => {
  opt.extend = SimpleDirective
  return Directive.register(name, opt)
}), {
  SimpleDirective
})
