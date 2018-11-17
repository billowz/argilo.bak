import argilo from 'argilo'
import { error } from 'devlevel'
const workbench = argilo({
	template: `<div class="container-fluid">
  <div class="row"  style="height: 100%">
    <div class="col-md-3">
      <h3>Benchmarks</h3>
      <ul class="list-group" style="height: 100%">
        <li ag-each="suite in suites"   class="list-group-item"> <a ag-onclick="run(suite)" href="#"> {suite.name}</a></li>
      </ul>
    </div>
    <div class="col-md-9" ag-if="current">
      <h3>{current.name}</h3>
      <table class="table table-hover table-striped ">
        <tbody>
            <tr>
                <td class="col-md-4"> Test Name</td>
                <td class="col-md-6"> Ops(ops/sec) </td>
                <td class="col-md-1"> Sampled </td>
                <td class="col-md-1"> Status </td>
            </tr>
            <tr ag-each="row in current.results">
                <td class="col-md-4"> {row.name} </td>
                <td class="col-md-6"> {row.hz + '\xb1' + row.rme}%</td>
                <td class="col-md-1"> {row.sampled} </td>
                <td class="col-md-1"> {row.status} </td>
            </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>`,
	view: {
		init() {
			this.suites = []
			this.suiteMap = {}
			this.runing = false
		},
		run(desc) {
			this.runing = true
			this.current = desc
			desc.results = []
			var me = this
			var suite = (desc.benchmark = new Benchmark.Suite(desc.name, desc.suiteOptions).on('complete', event => {
				this.runing = false
			}))
			window.benchmark = function(name, runner, benchOptions) {
				let result = {
					name,
					status: 'idle',
					hz: 0,
					rme: 0,
					sampled: 0
				}
				desc.results.push(result)
				suite.add(
					name,
					runner,
					argilo.assignIf(
						{
							onStart() {
								result = this.result = argilo.proxy(result)
								result.status = 'runing'
								if (benchOptions && benchOptions.onStart) benchOptions.onStart.apply(this, arguments)
							},
							onComplete(event) {
								var target = event.target

								if (target.error) {
									this.result.status = 'error'
									error(target.error)
								} else {
									var hz = target.hz,
										stats = target.stats
									argilo.assign(this.result, {
										status: 'complete',
										hz: formatNumber(hz.toFixed(hz < 100 ? 2 : 0)),
										rme: stats.rme.toFixed(2),
										sampled: stats.sample.length
									})
								}
								if (benchOptions && benchOptions.onComplete)
									benchOptions.onComplete.apply(this, arguments)
							}
						},
						benchOptions
					)
				)
			}
			desc.runner()
			window.benchmark = undefined
			desc.benchmark.run({
				async: true
			})
		},
		add(name, runner, options) {
			let desc = {
				name,
				runner,
				benchmark: undefined,
				suiteOptions: options,
				results: undefined
			}
			if (!this.suiteMap[name]) {
				this.suiteMap[name] = desc
				this.suites = argilo.map(argilo.keys(this.suiteMap).sort(), n => this.suiteMap[n])
			} else {
				error(`same name benchmark suite "${name}"`)
			}
		}
	}
}).compile()

window.suite = function(name, runner, options) {
	workbench.add(name, runner, options)
}
window.xbenchmark = function() {}
window.xsuite = function() {}

argilo.ready(function() {
	workbench.appendTo(document.body)
})

function formatNumber(number) {
	number = String(number).split('.')
	return number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') + (number[1] ? '.' + number[1] : '')
}
export default workbench
