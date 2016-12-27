import {
  Directive,
  ContextKeyword,
  ElementKeyword,
  BindingKeyword,
  expressionParser
} from '../binding'
import {
  expression
} from '../parser'
import {
  hump,
  YieId
} from '../util'
import dom from '../../dom'
import logger from '../log'
import {
  createClass,
  each,
  indexOf,
  convert,
  hasOwnProp,
  assign,
  trim,
  isNil,
  isString,
  isObject,
  isArray
} from 'ilos'

const expressionArgs = [ContextKeyword, ElementKeyword, BindingKeyword]

const ExpressionDirective = createClass({
  extend: Directive,
  constructor() {
    this.super(arguments)
    this.observeHandler = this.observeHandler.bind(this)
    this.expression = expression(this.expr, expressionArgs, expressionParser)
    this.exprArgs = [this.proxy, this.el, this]
  },
  realValue() {
    return this.expression.execute(this.proxy, this.exprArgs)
  },
  value() {
    return this.expression.executeAll(this.proxy, this.exprArgs)
  },
  updateEl() {
    this.super(arguments)
    if (this.binded)
      this.update(this.value())
  },
  bind() {
    this.binded = true
    each(this.expression.identities, (ident) => {
      this.observe(ident, this.observeHandler)
    })
    this.update(this.value())
  },
  unbind() {
    each(this.expression.identities, (ident) => {
      this.unobserve(ident, this.observeHandler)
    })
    this.binded = false
  },
  blankValue(val) {
    if (arguments.length == 0) val = this.value()
    return isNil(val) ? '' : val
  },
  observeHandler(expr, val) {
    if (this.expression.isSimple()) {
      this.update(this.expression.filter(this.proxy, this.exprArgs, val))
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
  exprDirectives = {
    text: {
      type: 'block',
      update(val) {
        dom.text(this.el, this.blankValue(val))
      }
    },
    html: {
      type: 'block',
      update(val) {
        dom.html(this.el, this.blankValue(val))
      }
    },
    'class': {
      update(value) {
        if (value && typeof value == 'string') {
          this.handleArray(trim(value).split(/\s+/))
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
        each(value, (val) => {
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
            if (!value || (isArr ? indexOf(value, key) == -1 : !hasOwnProp(value, key))) {
              dom.removeClass(el, key)
            }
          }
        }
      }
    },
    'style': {
      update(value) {
        if (value && isString(value)) {
          dom.style(this.el, value)
        } else if (value && isObject(value)) {
          this.handleObject(value)
        }
      },
      handleObject(value) {
        this.cleanup(value)
        let keys = this.prevKeys = [],
          el = this.el
        each(value, (val, key) => {
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
            if (!value || !hasOwnProp(value, key))
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
        this.super(arguments)
        return this.yieId
      },
      unbind() {
        this.super(arguments)
      },
      update(val) {
        if (!val) {
          dom.css(this.el, 'display', 'none')
        } else {
          if (!this.yieId.doned)
            this.yieId.done()
          dom.css(this.el, 'display', '')
        }
      }
    },
    checked: {
      update(val) {
        isArray(val) ? dom.checked(this.el, indexOf(val, dom.val(this.el))) : dom.checked(this.el, !!val)
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
      updateEl(el) {
        dom.off(this.el, this.event, this.onChange)
        dom.on(el, this.event, this.onChange)
        this.el = el
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
        this.setRealValue(this.expression.restore(this.proxy, this.exprArgs, val))
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

export default assign(convert(exprDirectives, (opt, name) => {
  return hump(name + 'Directive')
}, (opt, name) => {
  opt.extend = ExpressionDirective
  return Directive.register(name, opt)
}), {
  ExpressionDirective
})
