(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('argilo')) :
  typeof define === 'function' && define.amd ? define('argiloDoc', ['argilo'], factory) :
  (global.argiloDoc = factory(global.argilo));
}(this, function (argilo) {

  argilo = 'default' in argilo ? argilo['default'] : argilo;

  function __$styleInject(css, returnValue) {
    if (typeof document === 'undefined') {
      return returnValue;
    }
    css = css || '';
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
    return returnValue;
  }
  __$styleInject("body,li,ul{margin:0;padding:0;font-size:12px;font-family:Open Sans,Helvetica Neue,Helvetica,Arial,Microsoft YaHei,sans-serif}li,ul{list-style:none}.hbox-item{font-size:12px;font-family:Open Sans,Helvetica Neue,Helvetica,Arial,Microsoft YaHei,sans-serif;letter-spacing:normal;word-spacing:normal;vertical-align:top;display:inline-block;*display:inline;*zoom:1}.hbox{font-size:0;*word-spacing:-1px}@media screen and (-webkit-min-device-pixel-ratio:0){.hbox{letter-spacing:-4px}}.vbox .vbox-item{display:block}.title{width:200px;text-align:center;font-size:30px}.menu{vertical-align:bottom;border-bottom:1px solid #ccc}.menu .node{padding:5px 10px;font-size:20px;border-top-left-radius:5px;border-top-right-radius:5px;cursor:pointer}.menu .node:hover{background-color:#666;color:#fff}.menu .node.active,.menu .node.active:hover{background-color:#aaa;color:#fff}", undefined);

  argilo.configuration.config('textParser', new argilo.TextParser('{', '}'));

  argilo({
    name: 'doc.menu.node',
    template: '\n<div class="menu hbox">\n  <li ag-each="node in @menu" class="hbox-item node">{node.text}</li>\n<div>\n'
  });
  argilo({
    name: 'doc.menu',
    template: '\n<div class="menu hbox">\n  <li ag-each="node in @menu" class="hbox-item node">{node.text}</li>\n<div>\n'
  });
  var Doc = argilo({
    name: 'doc.document',
    template: '<div class="vbox">\n    <div class="hbox vbox-item" style="padding:10px 0">\n      <div class="hbox-item title">\n        <span>{title}</span>\n      </div>\n      <div class="hbox-item">\n        <div ag-cmp="doc.menu" props="{menu: @menu}"></div>\n      </div>\n    </div>\n</div>'
  }).compile({
    title: 'Agrilo',
    menu: [{
      text: 'Compontent'
    }, {
      text: 'Directive'
    }, {
      text: 'Observe'
    }, {
      text: 'Utils'
    }, {
      text: 'DomUtils'
    }]
  });

  argilo.ready(function () {
    Doc.appendTo(document.body);
  });

  return Doc;

}));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJnaWxvLmRvYy5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
