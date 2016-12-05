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
export {
  default as Collector
}
from './Collector'
export * from './compontent'
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
