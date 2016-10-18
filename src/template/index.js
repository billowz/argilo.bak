import _ from 'ilos'
import DomParser from './DomParser'
import DirectiveParser from './DirectiveParser'
import TextParser from './TextParser'
import configuration from '../configuration'


let templateId = 0
const templateCache = {}
let inited = false

export default _.dynamicClass({
  statics: {
    get(id) {
      return templateCache[id]
    },
    DirectiveParser: DirectiveParser,
    TextParser: TextParser
  },
  constructor(templ, cfg = {}) {
    if (!inited) {
      configuration.nextStatus()
      inited = true
    }
    this.id = cfg.id || (templateId++)
    if (_.hasOwnProp(templateCache, this.id)) {
      throw new Error('Existing Template[' + this.id + ']')
    }
    this.parser = new DomParser(templ)
    templateCache[this.id] = this
  },
  complie(scope) {
    return this.parser.complie(scope)
  }
})
