import _ from 'ilos'

const queue = []
let waiting = false

function flushQueue() {
  let observi
  flushing = true
  while (observi = queue.shift()) {
    observi.notify()
  }
  waiting = false
}

export default function notify(observi) {
  queue.push(observi)
  if (!waiting) {
    waiting = true
    _.nextTick(flushQueue)
  }
}
