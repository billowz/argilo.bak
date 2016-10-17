import Watcher from './Watcher'
import _ from 'ilos'
import configuration from './configuration'
import logger from './log'

const cfg = configuration.get()

let watchers = [],
  currentWatcher

export function registerWatcher(name, priority, validator, builder) {
  if (!watchers)
    throw new Error('Can not register Watcher in runtime')
  watchers.push({
    name,
    priority,
    validator,
    builder
  })
  watchers.sort((w1, w2) => w1.priority - w2.priority)
  logger.info('register observi Watcher[%s], priority = %d', name, priority)
}

function initWatcher() {
  if (!watchers) return
  configuration.nextStatus()
  _.each(watchers, watcher => {
    let {
      validator,
      builder,
      name,
      priority
    } = watcher

    if (!_.isFunc(validator) || validator(cfg)) {
      try {
        watcher = builder(cfg)
        if (_.isFunc(watcher) && _.isExtendOf(watcher, Watcher)) {
          currentWatcher = watcher
          logger.info('apply observi Watcher[%s], priority = %d', name, priority)
          return false
        } else {
          logger.error('invalid observi Watcher[%s], priority = %d', name, priority)
        }
      } catch (e) {
        logger.error('apply observi Watcher[%s] failed', e)
      }
    }
  })
  if (!currentWatcher)
    throw new Error('Init observi Watcher Failed')
  watchers = undefined // clean watchers
  return currentWatcher
}

export function createWatcher(obj) {
  let Watcher = currentWatcher || initWatcher()
  return new Watcher(obj)
}
