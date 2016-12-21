/*
 * argilo-document v0.0.1 built in Wed, 21 Dec 2016 10:42:52 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 * https://github.com/tao-zeng/argilo
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('argilo')) :
  typeof define === 'function' && define.amd ? define('argiloDoc', ['argilo'], factory) :
  (global.argiloDoc = factory(global.argilo));
}(this, function (argilo) {

  argilo = 'default' in argilo ? argilo['default'] : argilo;

  var index = {
    argilo: argilo
  };

  return index;

}));
//# sourceMappingURL=argilo.doc.js.map