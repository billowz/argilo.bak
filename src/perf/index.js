import argilo from 'argilo'
import performance from './performance'
import * as _perfs from './perf'

const perfs = []
argilo.each(_perfs, (perf) => {
  argilo.each(perf, p => {
    perfs.push(p)
  })
})

performance.perfs = perfs


argilo.ready(function() {
  performance.ui = argilo({
    template: `<div class="container-fluid">
  <div class="row"  style="height: 100%">
    <div class="col-md-2">
      <ul class="list-group" style="height: 100%">
        <li ag-each="perf in perfs"   class="list-group-item"> <span ag-onclick="run(perf)"> {perf.name} </span></li>
      </ul>
    </div>
    <div class="col-md-10" ag-ref="body">

    </div>
  </div>
</div>`,
    controller: {
      currentCase: undefined,
      run(perf) {
        if (this.runing) return
        var c = this.currentCase
        if (c) {
          c.distory && c.distory()
          if (argilo.isArray(c.report)) {
            argilo.each(c.report, r => {
              r.remove(true)
            })
          } else if (c.report) {
            c.report.remove(true)
          }
          this.refs.body.innerHTML = ''
        }
        this.currentCase = perf
        this.runing = true
        perf.report = perf.run(performance, this.refs.body, () => {
          this.runing = false
        })
      }
    }
  }).compile({
    perfs
  }).appendTo(document.body)
})

export default performance
