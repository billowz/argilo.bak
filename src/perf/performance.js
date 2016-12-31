import argilo from 'argilo'

const benchmarkReportor = argilo({
  template: `<table class="table table-hover table-striped ">
    <tbody>
        <tr>
            <td class="col-md-6"> Test Name</td>
            <td class="col-md-6"> Ops(ops/sec) </td>
        </tr>
        <tr ag-each="row in results">
            <td class="col-md-6"> {row.name} (repeat {row.sampled})</td>
            <td class="col-md-6"> {row.hz} {'\xb1'+row.rme}%</td>
        </tr>
    </tbody>
</table>`
})

const runReportor = argilo({
  template: `<table class="table table-hover table-striped ">
  <tbody>
      <tr>
          <td class="col-md-3"> Test Name</td>
          <td class="col-md-1"> Mean(ms) </td>
          <td class="col-md-1"> Min(ms) </td>
          <td class="col-md-1"> Max(ms) </td>
          <td class="col-md-1"> Memory Before </td>
          <td class="col-md-1"> Memory After </td>
          <td class="col-md-4"> Perfs </td>
      </tr>
      <tr ag-each="row in results">
          <td class="col-md-3"> {row.name} (repeat {row.repeat})</td>
          <td class="col-md-1"> {row.mean} </td>
          <td class="col-md-1"> {row.min} </td>
          <td class="col-md-1"> {row.max} </td>
          <td class="col-md-1"> {row.beforeMemory| memunit 0,"N/A"}</td>
          <td class="col-md-1"> {row.memory| memunit 0,"N/A"}</td>
          <td class="col-md-4"> {row.perfs.join(', ')} </td>
      </tr>
  </tbody>
</table>`
})

export default {
  benchmark(tasks, cb) {
      var report = benchmarkReportor.compile({
        results: [],
        status: 'runing'
      })
      setTimeout(function() {
        var suite = new Benchmark.Suite()
        for (var i = 0; i < tasks.length; i++) {
          suite.add(tasks[i].name, tasks[i].runner)
        }
        suite.on('cycle', function(event) {
            var t = event.target,
              hz = t.hz
            report.results.push({
              name: t.name,
              hz: formatNumber(hz.toFixed(hz < 100 ? 2 : 0)),
              rme: t.stats.rme.toFixed(2),
              sampled: t.stats.sample.length
            })
            console.log(String(event.target))
          })
          .on('complete', function() {
            cb(report.results)
            report.status = 'complete'
          }).on('error', function(e) {
            console.error(e.target.error)
          })
          .run()
      }, 100)
      return report
    },
    runtime(tasks, cb, opt) {
      var report = runReportor.compile({
        results: [],
        status: 'runing'
      })
      for (var i = 0; i < tasks.length; i++) {
        var t = tasks[i]
        run(t.name, t.runner, t.repeat || opt.repeat, t.preheat || opt.preheat, t.before, t.after, t.cycle, t.end)
      }
      cb(report.results)
      report.status = 'complete'
      return report
    }
}


function run(name, runner, repeat, preheat, before, after, cycle, end) {
  return function() {
    var memory = performance.memory.totalJSHeapSize
    var start, stop, perfs = []
    for (var i = 0; i < repeat; i++) {
      before && before()
      start = performance.now()
      runner()
      stop = performance.now()
      perfs[i] = stop - start
      after && after()
      cycle && cycle(perfs[i])
    }
    var total = 0,
      min, max
    for (var i = preheat; i < repeat; i++) {
      var v = perfs[i]
      total += v
      if (min === undefined || v < min)
        min = v
      if (max === undefined || v > max)
        max = v
    }
    var mean = (total / (repeat - preheat)).toFixed(2)
    min = min.toFixed(2)
    max = max.toFixed(2)
    end && end(perfs)
    console.log('performance[' + name + ']: mean = ' + mean + ', min = ' + min + ', max = ' + max)
    results.push({
      name: name,
      min: min,
      max: max,
      mean: mean,
      repeat: repeat - preheat,
      perfs: perfs.slice(preheat).map(function(v) {
        return v.toFixed(2)
      }),
      beforeMemory: memory,
      memory: performance.memory.totalJSHeapSize
    })
  }
}

function formatNumber(number) {
  number = String(number).split('.');
  return number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') +
    (number[1] ? '.' + number[1] : '');
}
