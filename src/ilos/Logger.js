import {
  isString
} from './is'
import {
  format
} from './string'
import {
  each,
  indexOf,
  filter
} from './collection'
import {
  createClass
} from './class'

const logLevels = ['debug', 'info', 'warn', 'error'],
  tmpEl = document.createElement('div'),
  slice = Array.prototype.slice,
  SimulationConsole = createClass({
    constructor() {
      tmpEl.innerHTML = `<div id="simulation_console"
    style="position:absolute; top:0; right:0; font-family:courier,monospace; background:#eee; font-size:10px; padding:10px; width:200px; height:200px;">
  <a style="float:right; padding-left:1em; padding-bottom:.5em; text-align:right;">Clear</a>
  <div id="simulation_console_body"></div>
</div>`
      this.el = tmpEl.childNodes[0]
      this.clearEl = this.el.childNodes[0]
      this.bodyEl = this.el.childNodes[1]
    },
    appendTo(el) {
      el.appendChild(this.el)
    },
    log(style, msg) {
      tmpEl.innerHTML = `<span style="${style}">${msg}</span>`
      this.bodyEl.appendChild(tmpEl.childNodes[0])
    },
    parseMsg(args) {
      let msg = args[0]
      if (isString(msg)) {
        let f = format.format.apply(null, args)
        return [f.format].concat(slice.call(args, f.count)).join(' ')
      }
      return args.join(' ')
    },
    debug() {
      this.log('color: red;', this.parseMsg(arguments))
    },
    info() {
      this.log('color: red;', this.parseMsg(arguments))
    },
    warn() {
      this.log('color: red;', this.parseMsg(arguments))
    },
    error() {
      this.log('color: red;', this.parseMsg(arguments))
    },
    clear() {
      this.bodyEl.innerHTML = ''
    }
  })

let console = window.console
export const Logger = createClass({
  statics: {
    enableSimulationConsole() {
      if (!console) {
        console = new SimulationConsole()
        console.appendTo(document.body)
      }
    }
  },
  constructor(_module, level) {
    this.module = _module
    this.setLevel(level)
  },
  setLevel(level) {
    this.level = indexOf(logLevels, level || 'info')
  },
  getLevel() {
    return logLevels[this.level]
  },
  _print(level, args, trace) {
    try {
      Function.apply.call(console[level] || console.log, console, args)
      if (trace && console.trace) console.trace()
    } catch (e) {}
  },
  _log(level, args, trace) {
    if (level < this.level || !console) return
    args = this._parseArgs(level, args)
    this._print(level, args, trace)
  },
  _parseArgs(level, args) {
    let i = 0,
      l = args.length,
      msg = `[${logLevels[level]}] ${this.module} - `,
      _args = []

    if (isString(args[0])) {
      msg += args[0]
      i++
    }
    _args.push(msg)
    for (; i < l; i++) {
      this.parseArg(_args, args[i])
    }
    return _args
  },
  parseArg(args, arg) {
    if (arg === undefined) {
      args.push('undefined')
    } else if (arg instanceof Error) {
      args.push(arg.message, '\n', arg.stack)
    } else {
      args.push(arg)
    }
  },
  debug() {
    this._log(0, arguments)
  },
  info() {
    this._log(1, arguments)
  },
  warn() {
    this._log(2, arguments)
  },
  error() {
    this._log(3, arguments)
  }
})
export const logger = new Logger('default', 'info')
