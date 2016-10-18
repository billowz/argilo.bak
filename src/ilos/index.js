import './polyfill'
import * as common from './common'
import * as is from './is'
import * as coll from './collection'
import * as obj from './object'
import * as string from './string'
import * as cls from './class'
import * as util from './util'
import LinkedList from './LinkedList'
import Configuration from './Configuration'
import ConfigurationChain from './ConfigurationChain'
import Logger from './Logger'

export default obj.assign({
  LinkedList,
  Configuration,
  ConfigurationChain,
  Logger
}, common, is, coll, obj, string, cls, util)
