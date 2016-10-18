import Template from './template'
import expression from './expression'
import translate from './translate'
import {
  Directive
} from './binding'
import directives from './directives'
import * as util from './util'
import dom from './dom'
import configuration from './configuration'
import logger from './log'
import _ from 'ilos'
import observi from 'observi'

const core = _.assign({}, {
  Template,
  translate,
  expression,
  Directive,
  directives,
  logger,
  configuration: new _.ConfigurationChain(configuration, observi.configuration)
}, dom, util)

function argilo(templ, cfg) {
  return new Template(templ, cfg)
}
_.assignIf(argilo, {
  argilo,
  observi,
  ilos: _
}, core, _, observi.observi)
export default argilo
