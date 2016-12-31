import TemplateParser from '../TemplateParser'
import '../../directives'

function compile() {
  return new TemplateParser(`
            <table class="table table-hover table-striped test-data" >
                <tbody>
                    <tr ag-each="item in rows track by id" ag-class="{'danger': item.id == selected}">
                        <td class="col-md-1">{item.id}</td>
                        <td class="col-md-4">
                            <a ag-onclick="select(item.id)">{item.label}</a>
                        </td>
                        <td class="col-md-1">
                            <a>
                                <span class="glyphicon glyphicon-remove" aria-hidden="true" ag-onclick="delete(item.id)"></span>
                            </a>
                        </td>
                        <td class="col-md-6"></td>
                    </tr>
                </tbody>
            </table>
          `)
}
const templ = new TemplateParser(`
            <table class="table table-hover table-striped test-data" >
                <tbody>
                    <tr ag-class="{'danger': item.id == selected}">
                        <td class="col-md-1">{item.id}</td>
                        <td class="col-md-4">
                            <a ag-onclick="select(item.id)">{item.label}</a>
                        </td>
                        <td class="col-md-1">
                            <a>
                                <span class="glyphicon glyphicon-remove" aria-hidden="true" ag-onclick="delete(item.id)"></span>
                            </a>
                        </td>
                        <td class="col-md-6"></td>
                    </tr>
                </tbody>
            </table>
          `)
export default {
  name: 'TemplateParser',
  run(perf, el, cb) {
    return perf.benchmark([{
      name: 'compile',
      runner: function() {
        compile()
      }
    }, {
      name: 'build',
      runner: function() {
        templ.clone({
          context: {},
          Controller: function() {}
        })
      }
    }], cb).appendTo(el)
  }
}
