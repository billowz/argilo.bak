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
import dom from '../../dom'
import {
  proxy,
  createProxy,
  $each,
  eq
} from 'observi'
import {
  createClass,
  each,
  eachObj,
  eachArray,
  map,
  get,
  create,
  isArrayLike,
  isEmptyStr,
  typestr,
  numberType,
  objectType,
  emptyFn,
  LinkedList
} from 'ilos'

const expressionArgs = [ContextKeyword, ElementKeyword, BindingKeyword],
  eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
  eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/


const Cache = createClass({
  constructor() {
    this.keymap = {}
    this.queue = new LinkedList()
  },
  encache(data, prev) {
    let index = data.index,
      keymap = this.keymap
    if (index in keymap)
      throw new Error('EachDirective: index is not uniqued')
    keymap[index] = data
    if (prev) {
      this.queue.after(prev, data)
    } else {
      this.queue.push(data)
    }
    return this
  },
  decacheByIndex(index) {
    let keymap = this.keymap,
      data = keymap[index]
    if (data) {
      delete keymap[index]
      this.queue.remove(data)
    }
    return data
  },
  decache() {
    let data = this.queue.pop()
    if (data)
      delete this.keymap[data.index]
    return data
  },
  each(cb, scope) {
    return this.queue.each(cb, scope)
  },
  size() {
    return this.queue.size()
  },
  isEmpty() {
    return this.queue.empty()
  }
})
export default Directive.register('each', createClass({
  extend: Directive,
  type: 'template',
  alone: true,
  priority: 10,
  constructor() {
    this.super(arguments)
    this.observeHandler = this.observeHandler.bind(this)
    let token = this.expr.match(eachReg)
    if (!token)
      throw Error(`Invalid Expression[${this.expr}] on Each Directive`)

    this.dataExpr = expression(token[2], expressionArgs, expressionParser)
    this.indexExpr = token[4]

    let aliasToken = token[1].match(eachAliasReg)
    if (!aliasToken)
      throw Error(`Invalid Expression[${token[1]}] on Each Directive`)

    this.valueAlias = aliasToken[2] || aliasToken[5]
    this.keyAlias = aliasToken[4] || aliasToken[7]

    this.begin = document.createComment('each begin')
    this.end = document.createComment('each end')
    dom.replace(this.el, this.begin)
    dom.after(this.end, this.begin)
    this.el = undefined
    this.version = 1
  },
  convertData(data) {
    let convert = false
    if (data) {
      var type = typestr(data)
      if (isArrayLike(data, type)) {
        data = data.length && data
      } else if (type === numberType) {
        var arr = new Array(data)
        for (var i = 0; i < data; i++)
          arr[i] = i
        data = arr
        convert = true
      } else if (type === objectType) {
        if ($eachObj(data, (v) => false) === false)
          data = undefined
      } else {
        data = undefined
      }
    }
    return {
      convert,
      data
    }
  },
  update(data) {
    var start = performance.now()
    let cache = this.cache,
      before = this.begin,
      convert = this.convertData(data)

    function debug(msg) {
      console.log(msg)
    }

    if (!(data = convert.data)) {
      this.cache = undefined
      if (cache && !cache.isEmpty()) {
        var parent = before.parentNode,
          emptyDom = isEmptyDom(parent, before, this.end)
        var s = performance.now()
        if (emptyDom) {
          parent.innerHTML = ''
          dom.append(parent, [before, this.end])

          debug(`remove views use ${performance.now()-s} ms, total-rows: ${cache.size()}`)
          s = performance.now()

          cache.each((desc, index) => {
            desc.view.unbind(false)
          })

          debug(`unbind views use ${performance.now()-s} ms, total-rows: ${cache.size()}`)
        } else {
          cache.each((desc, index) => {
            desc.view.remove(true, false)
          })
          debug(`remove & unbind views use ${performance.now()-s} ms, total-rows: ${cache.size()}`)
        }
      }
    } else {
      var resetData = proxy.isEnable() && !convert.convert,
        ncache = this.cache = new Cache(),
        indexExpr = this.indexExpr
      if (cache && !cache.isEmpty()) {
        var ndescs = []
        var s = performance.now()
        $each(data, (item, key) => {
          let index = indexExpr ? get(item, indexExpr) : key,
            desc = cache.decacheByIndex(index)
          if (desc) {
            this.updateChild(desc.view, item, index)
            if (resetData)
              data[key] = proxy(item)
          } else {
            desc = {
              item,
              index,
              key
            }
            ndescs.push(desc)
          }
          ncache.encache(desc)
        })
        debug(`parse datas use ${performance.now()-s} ms, total rows: ${ncache.size()}, matched rows: ${ncache.size()-ndescs.length}`)
        s = performance.now()
        var reused = 0
        eachArray(ndescs, desc => {
          let idle = cache.decache(),
            {
              index,
              item,
              key
            } = desc
          desc.item = desc.key = undefined
          if (idle) {
            reused++;
            this.updateChild(idle.view, item, index)
            desc.view = idle.view
          } else {
            desc.view = this.createChild(item, index)
              .bind(false)
          }
          if (resetData)
            data[key] = proxy(item)
        })
        debug(`create non-matched views use ${performance.now()-s} ms, re-used rows: ${reused}, created rows: ${ndescs.length-reused}`)
        s = performance.now()

        cache.each(desc => {
          desc.view.remove(true, false)
        })
        debug(`clear cached views use ${performance.now()-s} ms, cache-rows: ${cache.size()}`)
        s = performance.now()

        var i = 0
        ncache.each(desc => {
          let view = desc.view,
            el = view.$el
          if (before.nextSibling !== el[0]) {
            view.after(before, false, false)
            i++
          }
          before = el[el.length - 1]
        })
        debug(`append views use ${performance.now()-s} ms, total rows: ${i}`)
      } else {
        var frame = document.createDocumentFragment()
        var s = performance.now()
        var rownum = $each(data, (item, key) => {
          let index = indexExpr ? get(item, indexExpr) : key,
            view = this.createChild(item, index)
          ncache.encache({
            index,
            view
          })
          if (resetData)
            data[key] = proxy(item)
        })
        debug(`created views use ${performance.now()-s} ms, total rows: ${rownum}`)
        s = performance.now()

        ncache.each(desc => {
          desc.view.bind(false)
        })

        debug(`binded views use ${performance.now()-s} ms, total rows: ${rownum}`)
        s = performance.now()

        ncache.each(desc => {
          desc.view.appendTo(frame, false, false)
        })

        dom.after(frame, before)
        debug(`append views use ${performance.now()-s} ms, total rows: ${rownum}`)
      }
    }
    debug(`diff use ${performance.now()-start} ms`)
    start = performance.now()
    setTimeout(function() {
      debug(`render use ${performance.now()-start} ms\n\n`)
    }, 0)
  },
  createChild(value, index) {
    return this.proxy.clone(this.templateParser, false, (ctx) => {
      ctx[this.valueAlias] = value
      if (this.keyAlias)
        ctx[this.keyAlias] = index
    })
  },
  updateChild(ctx, value, index) {
    let {
      keyAlias,
      valueAlias
    } = this
    if (!eq(ctx[valueAlias], value))
      ctx[valueAlias] = value

    if (keyAlias && ctx[keyAlias] !== index)
      ctx[keyAlias] = index
  },
  bind() {
    eachArray(this.dataExpr.identities, (ident) => {
      this.observe(ident, this.observeHandler)
    })
    this.update(this.target())
  },
  unbind() {
    eachArray(this.dataExpr.identities, (ident) => {
      this.unobserve(ident, this.observeHandler)
    })
  },
  target() {
    return this.dataExpr.executeAll(this.proxy, [this.proxy, this.el, this])
  },
  observeHandler(expr, target) {
    if (this.dataExpr.isSimple()) {
      target = this.dataExpr.filter(this.proxy, [this.proxy, this.el, this], target)
    } else {
      target = this.target()
    }
    this.update(target)
  }
}))

function isEmptyDom(el, begin, end) {
  var first = el.firstChild,
    last = el.lastChild
  while (first !== begin) {
    if (!isEmptyNode(first))
      return false
    first = first.nextSibling
  }
  while (last !== end) {
    if (!isEmptyNode(last))
      return false
    last = last.previousSibling
  }
  return true
}

function isEmptyNode(node) {
  switch (node.nodeType) {
    case document.ELEMENT_NODE:
      return false
    case document.TEXT_NODE:
      if (!isEmptyStr(node.data))
        return false
  }
  return true
}
