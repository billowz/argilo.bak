import {
  createWatcher
} from './watcherFactory'
import notify from './notify'
import proxy from './proxy'
import _ from 'ilos'
import configuration from './configuration'
import logger from './log'


configuration.register('bindWatcher', '__observi_watcher__', 'init')
configuration.register('lazy', true, 'init')

const hasOwn = Object.prototype.hasOwnProperty,
  cfg = configuration.get()

function getOrCreateWatcher(obj) {
  if (hasOwn.call(obj, cfg.bindWatcher))
    return obj[cfg.bindWatcher]
  return (obj[cfg.bindWatcher] = createWatcher(obj))
}

export default _.dynamicClass({
  constructor(obj, expr, path) {
    this.obj = obj
    this.expr = expr
    this.path = path
    this.watchers = Array(path.length)
    this.callbacks = this.createCallbacks()
    this.watch(obj, 0)
    this.watcher = this.watchers[0]
    this.handlers = new _.LinkedList()
  },
  on(handler) {
    return this.handlers.push(handler)
  },
  un(handler) {
    if (!arguments.length) {
      var size = this.landlers.size()
      this.handlers.clean()
      return size
    } else {
      return this.handlers.remove(handler)
    }
  },
  isListened(handler) {
    return _.isNil(handler) ? !this.handlers.empty() : this.handlers.contains(handler)
  },
  fire(val, oldVal, eq) {
    var expr = this.expr,
      _proxy = this.watcher.proxy
    this.handlers.each(cb => cb(expr, val, oldVal, _proxy, eq))
  },
  notify() {
    if (this.dirty) {
      this.fire(this.newVal, this.oldVal, this.eq)
      this.dirty = false
    }
  },
  update(val, oldVal, eq) {
    if (cfg.lazy) {
      this.newVal = val
      if (this.dirty) {
        if ((eq = proxy.eq(val, this.oldVal)) && _.isPrimitive(val)) {
          this.dirty = false
          return
        }
        this.eq = eq
      } else {
        this.oldVal = oldVal
        this.eq = eq
        this.dirty = true
        notify(this)
      }
    } else {
      this.fire(val, oldVal, eq)
    }
  },
  createCallbacks() {
    return _.map(this.path, function(prop, i) {
      return this.createCallback(i)
    }, this)
  },
  createCallback(idx) {
    let path = this.path,
      nextIdx = idx + 1,
      rpath = (path.length - nextIdx) && path.slice(nextIdx)

    return (attr, val, oldVal, watcher, eq) => {
      if (rpath) {
        if (eq) return

        // unwatch & get old value
        if (oldVal) {
          oldVal = proxy.obj(oldVal)
          this.unwatch(oldVal, nextIdx)
          oldVal = _.get(oldVal, rpath)
        } else {
          oldVal = undefined
        }
        // watch & get new value
        if (val) {
          if (proxy.isEnable()) { // reset value on up-level object
            val = proxy.obj(val)
            var watcher = this.watch(val, nextIdx),
              i = 0,
              obj = this.obj
            while (i < idx) { // find up-level object
              obj = proxy.obj(obj[path[i++]])
              if (!obj) return
            }
            obj[path[idx]] = watcher.proxy
          } else {
            this.watch(val, nextIdx)
          }
          val = _.get(val, rpath)
        } else {
          val = undefined
        }
        if ((eq = proxy.eq(val, oldVal)) && _.isPrimitive(val))
          return
      }
      this.update(val, oldVal, eq)
    }
  },
  watch(obj, idx) {
    let path = this.path,
      attr = path[idx],
      watcher = this.watchers[idx] || (this.watchers[idx] = getOrCreateWatcher(obj)),
      val

    watcher.setter(attr, this.callbacks[idx])

    if (++idx < path.length && (val = obj[attr])) {
      if (proxy.isEnable()) {
        obj[attr] = this.watch(proxy.obj(val), idx).proxy
      } else {
        this.watch(val, idx)
      }
    }
    return watcher
  },
  unwatch(obj, idx) {
    let watcher = this.watchers[idx]
    if (watcher) {
      var path = this.path,
        attr = path[idx],
        val

      watcher.unsetter(attr, this.callbacks[idx])
      this.watchers[idx] = undefined

      if (++idx < path.length && (val = obj[attr]))
        this.unwatch(proxy.obj(val), idx)
    }
    return watcher
  }
})
