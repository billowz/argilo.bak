export {
  Directive
}
from './binding'
export {
  default as directives
}
from './directives'
export {
  DirectiveParser,
  TextParser,
  expression
}
from './parser'
export * from './Controller'
export * from './Compontent'
import configuration from './configuration'
import {
  configuration as observiConfiguration
} from 'observi'
import {
  ConfigurationChain
} from 'ilos'

const config = new ConfigurationChain(configuration, observiConfiguration)

export {
  config as configuration
}
