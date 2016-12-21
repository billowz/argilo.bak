var Monitor = Monitor || (function() {
  var memoryDom =
    '<div ag-if="state.memoryEnable" ag-style="{width:state.memoryWidth}" style="position:fixed;right:0;bottom:0;opacity:0.9;cursor:pointer;">' +
    '  <div style="padding:0 0 3px 3px;text-align:left;background-color:#020;">' +
    '     <div style="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px;">' +
    '         Mem: ${state.heapSize | memunit 0,"N/A" }' +
    '     </div>' +
    '     <div style="position:relative;width:100px;height:30px;overflow:hidden">' +
    '         <span ag-each="slot in state.slots" ag-style="{\'height\': slot.height, \'margin-top\':30-slot.height, \'background-color\': slot.color, \'width\':state.memorySlotWidth}" style="float:right;"></span>' +
    '     </div>' +
    '  </div>' +
    '</div>'
  var frameRateDom =
    '<div ag-style="{width:state.rateWidth, right: state.memoryEnable ? state.memoryWidth : 0}" style="opacity:0.9;cursor:pointer;position:fixed;bottom:0px;">' +
    '   <div style="padding:0 0 3px 3px;text-align:left;background-color:#020;">' +
    '      <div style="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px">' +
    '         Repaint rate: ${state.rate}/sec' +
    '      </div>' +
    '   </div>' +
    '</div>'
  var perf = window.performance || {}
  if (!perf && !perf.memory) {
    perf.memory = {
      totalJSHeapSize: 0,
      usedJSHeapSize: 0
    }
  }
  if (perf && !perf.memory) {
    perf.memory = {
      totalJSHeapSize: 0,
      usedJSHeapSize: 0
    }
  }
  if (perf.memory.totalJSHeapSize <= 0)
    argilo.logger.warn('totalJSHeapSize === 0... performance.memory is only available in Chrome .')
  return argilo({
    template: '<div>' + frameRateDom + memoryDom + '</div>',
    controller: {
      state: {
        memoryEnable: perf.memory.totalJSHeapSize > 0,
        slots: [],
        rate: 0,
        memoryWidth: 106,
        memorySlotWidth: 5,
        rateWidth: 180,
        heapSize: perf.memory.usedJSHeapSize
      },
      created: function() {
        this.updateMomory = this.updateMomory.bind(this)
      },
      mounted: function() {
        this.memoryInterval = setInterval(this.updateMomory, 1000)
      },
      unmounted: function() {
        clearInterval(this.memoryInterval)
      },
      updateMomory: (function() {
        var lastTime = new Date(),
          lastUsedHeap = perf.memory.usedJSHeapSize,
          msMin = 20,
          msMax = 0

        return function() {
          if (new Date() - lastTime < 1000 / 30) return
          lastTime = new Date()
          var delta = perf.memory.usedJSHeapSize - lastUsedHeap,
            color = delta < 0 ? '#830' : '#0f0',
            ms = perf.memory.usedJSHeapSize
          lastUsedHeap = ms

          msMin = Math.min(msMin, ms)
          msMax = Math.max(msMax, ms)
          this.state.heapSize = ms
          this.state.slots.push({
            height: Math.min(30, 30 - (ms / perf.memory.totalJSHeapSize) * 30),
            color: color
          })
          var rem = this.state.slots.length - (this.state.memoryWidth / this.state.memorySlotWidth)
          if (rem == 1) {
            this.state.slots.shift()
          } else if (rem > 1) {
            this.state.slots = this.state.slots.slice(rem)
          }
          this.state.slots = this.state.slots
        }
      })(),
      ping: (function() {
        var lastTime = new Date(),
          bucketSize = 20,
          bucket = []
        return function() {
          var start = lastTime,
            stop = new Date(),
            rate = 1000 / (stop - start),
            sum = 0
          bucket.push(rate)
          if (bucket.length > bucketSize)
            bucket.shift()
          for (var i = 0; i < bucket.length; i++) {
            sum = sum + bucket[i]
          }
          this.state.rate = (sum / bucket.length).toFixed(2)
          lastTime = stop
        }
      })()
    }
  }).compile().appendTo(document.body)
})()
