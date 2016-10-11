import _ from 'ilos'
import configuration from './configuration'

const cfg = configuration.get()

let watchers = [],
  currentWatcher

export function addWatcher(name, priority, checker, builder) {
  if (!watchers)
    throw new Error('Can not add Watcher in runtime')
  watchers.push({
    name,
    priority,
    checker,
    builder
  })
  watchers.sort((w1, w2) => w1.priority - w2.priority)
  logger.info('register observi Watcher[%s], priority = %d', name, priority)
}

function initWatcher() {
  if (!watchers) return
  each(watchers, watcher => {
    if (watcher.checker(cfg)) {
      try {
        currentWatcher = watcher.builder(cfg)
        logger.info('apply observi Watcher[%s], priority = %d', watcher.name, watcher.priority)
        return false
      } catch (e) {
        logger.error('apply observi Watcher[%s] failed', e)
      }
    }
  })
  watchers = undefined
  return currentWatcher
}

export function createWatcher(obj) {
  let Watcher = currentWatcher || initWatcher()
  return new Watcher(obj)
}

export const Watcher = _.dynamicClass({
  constructor(obj) {
    this.obj = obj
    this.proxy = proxy
  },
  watch() {

  },
  unwatch() {

  }
})
