import {
  dynamicClass,
  each
} from 'ilos'
import {
  Template
} from '../template'
dynamicClass({
  constructor(cfg) {
    this.template = cfg.template
    this.templateUrl = cfg.templateUrl
    this.$template = new Template(this.template, cfg.option)
    this.context = {
      $config: cfg.config || {},
      $scope: cfg.scope || {},
      $collector: cfg.collector || {}
    }
  }
})
