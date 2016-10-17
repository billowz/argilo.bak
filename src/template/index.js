import _ from 'ilos'
import DomParser from './DomParser'
import DirectiveParser from './DirectiveParser'
import TextParser from './TextParser'


let templateId = 0
const templateCache = {}

export default _.dynamicClass({
  statics: {
    get(id) {
      return templateCache[id]
    },
    DomParser: DomParser,
    DirectiveParser: DirectiveParser,
    TextParser: TextParser
  },
  constructor(templ, cfg = {}) {
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
