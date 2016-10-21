import dom from '../dom'
import {
  proxy
} from 'observi'
import {
  dynamicClass,
  each
} from 'ilos'

export default dynamicClass({
  constructor(scope) {
    this.scope = scope
    this.proxyHandler = this.proxyHandler.bind(this)
    proxy.on(scope, this.proxyHandler)
  },
  proxyHandler(obj, proxy) {
    this.scope = proxy || obj
  },
  before(target, bind) {
    if (bind !== false)
      this.bind()
    dom.before(this.el, dom.query(target))
    return this
  },
  after(target, bind) {
    if (bind !== false)
      this.bind()
    dom.after(this.el, dom.query(target))
    return this
  },
  prependTo(target, bind) {
    if (bind !== false)
      this.bind()
    dom.prepend(dom.query(target), this.el)
    return this
  },
  appendTo(target, bind) {
    if (bind !== false)
      this.bind()
    dom.append(dom.query(target), this.el)
    return this
  },
  remove(unbind) {
    dom.remove(this.el)
    if (unbind !== false)
      this.unbind()
  },
  bind() {
    if (!this.binded) {
      each(this.bindings, (bind) => {
        bind.bind()
      })
      this.binded = true
    }
    return this
  },
  unbind() {
    if (this.binded) {
      each(this.bindings, (bind) => {
        bind.unbind()
      })
      this.binded = false
    }
    return this
  },
  destroy() {
    proxy.un(this.scope, this.proxyHandler)
    if (this.binded)
      each(this.bindings, (bind) => {
        bind.unbind()
        bind.destroy()
      })
    dom.remove(this.el)
    this.bindings = undefined
    this.el = undefined
  }
})
