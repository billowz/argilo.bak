import dom from '../dom'
import {
  proxy
} from 'observi'
import {
  dynamicClass,
  each,
  isFunc
} from 'ilos'

export default dynamicClass({
  constructor(el, bindings, context) {
    this.el = el
    this.bindings = bindings
    proxy.obj(context).tpl = this
    this.context = context
    this.mounted = false
      // created event
  },
  props() {
    return proxy(this.context.props)
  },
  scope() {
    return proxy(this.context.scope)
  },
  collector() {
    return proxy(this.context)
  },
  toDocument(target, bind, fn) {
    if (bind !== false)
      this.bind()
    fn.call(this, target)
    this.mounted = true
      // mounted event
  },
  before(target, bind) {
    this.toDocument(target, bind, (target) => {
      dom.before(this.el, dom.query(target))
    })
    return this
  },
  after(target, bind) {
    this.toDocument(target, bind, (target) => {
      dom.after(this.el, dom.query(target))
    })
    return this
  },
  prependTo(target, bind) {
    this.toDocument(target, bind, (target) => {
      dom.prepend(dom.query(target), this.el)
    })
    return this
  },
  appendTo(target, bind) {
    this.toDocument(target, bind, (target) => {
      dom.append(dom.query(target), this.el)
    })
    return this
  },
  remove(unbind) {
    dom.remove(this.el)
    if (unbind !== false)
      this.unbind()
      // unmounted event
    this.mounted = false
  },
  bind() {
    if (!this.binded) {
      each(this.bindings, (bind) => {
        bind.bind()
      })
      this.binded = true
        // binded event
    }
    return this
  },
  unbind() {
    if (this.binded) {
      each(this.bindings, (bind) => {
        bind.unbind()
      })
      this.binded = false
        // unbinded event
    }
    return this
  },
  destroy() {
    if (this.binded)
      each(this.bindings, (bind) => {
        bind.unbind()
        bind.destroy()
      })
    dom.remove(this.el)
      // destroied event
  }
})
