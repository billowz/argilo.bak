import {
  hasOwnProp
} from './common'
import {
  each
} from './collection'
import {
  dynamicClass
} from './class'

const LIST_KEY = '__linked_list__'
let IDGenerator = 1

export default dynamicClass({
  statics: {
    ListKey: LIST_KEY
  },
  constructor() {
    this._id = IDGenerator++;
    this.length = 0
    this._header = undefined
    this._tail = undefined
    this._version = 1
  },
  _listObj(obj) {
    return hasOwnProp(obj, LIST_KEY) && obj[LIST_KEY]
  },
  _desc(obj) {
    let list = this._listObj(obj)
    return list && list[this._id]
  },
  _newDesc(obj) {
    return {
      obj: obj,
      prev: undefined,
      next: undefined,
      version: this._version++
    }
  },
  _getOrCreateDesc(obj) {
    let list = this._listObj(obj) || (obj[LIST_KEY] = {}),
      desc = list[this._id]
    return desc || (list[this._id] = this._newDesc(obj))
  },
  _unlink(desc) {
    let prev = desc.prev,
      next = desc.next

    if (prev) {
      prev.next = next
    } else {
      this._header = next
    }
    if (next) {
      next.prev = prev
    } else {
      this._tail = prev
    }
    this.length--
  },
  _move(desc, prev, alwaysMove) {
    let header = this._header

    if (header === desc || desc.prev)
      this._unlink(desc)

    desc.prev = prev
    if (prev) {
      desc.next = prev.next
      prev.next = desc
    } else {
      desc.next = header
      if (header)
        header.prev = desc
      this._header = desc
    }
    if (this._tail === prev)
      this._tail = desc
    this.length++
  },
  _remove(desc) {
    let obj = desc.obj,
      list = this._listObj(obj)

    this._unlink(desc)
    delete list[this._id]
  },
  push() {
    let cnt = 0
    each(arguments, (obj) => {
      let list = this._listObj(obj) || (obj[LIST_KEY] = {})

      if (!list[this._id]) {
        this._move((list[this._id] = this._newDesc(obj)), this._tail)
        cnt++
      }
    })
    return cnt
  },
  pop() {
    let head = this._header

    if (head) {
      this._remove(head)
      return head.obj
    }
    return undefined
  },
  shift() {
    let tail = this._tail

    if (tail) {
      this._remove(tail)
      return tail.obj
    }
    return undefined
  },
  first() {
    let l = arguments.length
    if (!l) {
      let head = this._header
      return head && head.obj
    }
    while (l--) {
      this._move(this._getOrCreateDesc(arguments[l]), undefined)
    }
    return this
  },
  last() {
    if (!arguments.length)
      return this._tail && this._tail.obj

    each(arguments, (obj) => {
      this._move(this._getOrCreateDesc(obj), this._tail)
    })
    return this
  },
  before(target) {
    let l = arguments.length,
      tdesc = this._desc(target),
      prev = tdesc && tdesc.prev

    if (l == 1)
      return prev && prev.obj
    while (l-- > 1) {
      this._move(this._getOrCreateDesc(arguments[l]), prev)
    }
    return this
  },
  after(target) {
    let l = arguments.length,
      tdesc = this._desc(target)
    if (l == 1) {
      var next = tdesc && tdesc.next
      return next && next.obj
    }
    while (l-- > 1) {
      this._move(this._getOrCreateDesc(arguments[l]), tdesc)
    }
    return this
  },
  contains(obj) {
    return !!this._desc(obj)
  },
  remove() {
    let cnt = 0
    each(arguments, (obj) => {
      let list = this._listObj(obj),
        desc = list && list[this._id]
      if (desc) {
        this._unlink(desc)
        delete list[this._id]
        cnt++
      }
    })
    return cnt
  },
  clean() {
    let desc = this._header
    while (desc) {
      delete this._listObj(desc.obj)[this._id]
      desc = desc.next
    }
    this._header = undefined
    this._tail = undefined
    this.length = 0
    return this
  },
  empty() {
    return this.length == 0
  },
  size() {
    return this.length
  },
  each(callback, scope) {
    let desc = this._header,
      ver = this._version

    while (desc) {
      if (desc.version < ver) {
        if (callback.call(scope || this, desc.obj, this) === false)
          return false
      }
      desc = desc.next
    }
    return true
  },
  map(callback, scope) {
    let rs = []
    this.each((obj) => {
      rs.push(callback.call(scope || this, obj, this))
    })
    return rs
  },
  filter(callback, scope) {
    let rs = []
    this.each((obj) => {
      if (callback.call(scope || this, obj, this))
        rs.push(obj)
    })
    return rs
  },
  toArray() {
    let rs = []
    this.each((obj) => {
      rs.push(obj)
    })
    return rs
  }
})
