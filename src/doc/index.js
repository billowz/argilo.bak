import argilo from 'argilo'
import * as styles from './doc.css'


argilo.configuration.config('textParser', new argilo.TextParser('{', '}'))

argilo({
  name: 'menu-node',
  template: `
<div class="menu hbox">
  <li ag-each="node in @menu" class="hbox-item node">{node.text}</li>
<div>
`
})
argilo({
  name: 'menu',
  template: `
<div class="menu hbox">
  <li ag-each="node in @menu" class="hbox-item node">{node.text}</li>
<div>
`
})
const Doc = argilo({
  name: 'Document',
  template: `<div class="vbox">
    <div class="hbox vbox-item" style="padding:10px 0">
      <div class="hbox-item title">
        <span>Argilo</span>
      </div>
      <div class="hbox-item">
        <div ag-cmp="menu" props="{menu: #menu}"></div>
      </div>
    </div>
</div>`
}).compile({
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
})

argilo.ready(function() {
  Doc.appendTo(document.body)
})
export default Doc
