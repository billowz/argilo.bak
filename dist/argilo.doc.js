/*
 * argilo-document v0.0.1 built in Thu, 22 Dec 2016 03:52:18 GMT
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

  function __$styleInject(css) {
      if (!css) return;

      if (typeof window == 'undefined') return;
      var style = document.createElement('style');
      style.setAttribute('media', 'screen');

      style.innerHTML = css;
      document.head.appendChild(style);
      return css;
  }
  __$styleInject("@font-size : 12\n@font-family: \"Open Sans\",\"Helvetica Neue\",Helvetica,Arial,'Microsoft YaHei',sans-serif\n\n.hbox {\n  font-size: 0;\n  *word-spacing: -1px;\n}\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  /* firefox 中 letter-spacing 会导致脱离普通流的元素水平位移 */\n  .hbox {\n    letter-spacing: -4px;\n    /* Safari 等不支持字体大小为 0 的浏览器, N 根据父级字体调节*/\n  }\n}\n.hbox .hbox-item {\n  font-size: 12px;\n  letter-spacing: normal;\n  word-spacing: normal;\n  vertical-align: top;\n  display: inline-block;\n  *display: inline;\n  *zoom: 1;\n}\n.vbox .vbox-item {\n  display: 'block';\n}\n");

  var index = {
    argilo: argilo
  };

  return index;

}));
//# sourceMappingURL=argilo.doc.js.map