var Monitor = Monitor || (function() {
    var perf = window.performance || {};
    if (!perf && !perf.memory) {
        perf.memory = {
            totalJSHeapSize: 0,
            usedJSHeapSize: 0
        };
    }
    if (perf && !perf.memory) {
        perf.memory = {
            totalJSHeapSize: 0,
            usedJSHeapSize: 0
        };
    }

    var Monitor = {
        memoryEnable: perf.memory.totalJSHeapSize > 0,
        slots: [],
        rate: 0,
        memoryTpl: null,
        frameRateTpl: null,
        memoryWidth: 106,
        memorySlotWidth: 5,
        rateWidth: 180,
        updateMomory: (function() {
            var lastTime = new Date(),
                lastUsedHeap = perf.memory.usedJSHeapSize,
                msMin = 20,
                msMax = 0;

            return function() {
                if (new Date() - lastTime < 1000 / 30) return;
                lastTime = new Date()
                var delta = perf.memory.usedJSHeapSize - lastUsedHeap,
                    color = delta < 0 ? '#830' : '#0f0',
                    ms = perf.memory.usedJSHeapSize;
                lastUsedHeap = ms;

                msMin = Math.min(msMin, ms);
                msMax = Math.max(msMax, ms);
                this.heapSize = bytesToSize(ms, 2)
                this.slots.push({
                    height: Math.min(30, 30 - (ms / perf.memory.totalJSHeapSize) * 30),
                    color: color
                })
                var rem = this.slots.length - (this.memoryWidth / this.memorySlotWidth)
                if (rem == 1) {
                    this.slots.shift()
                } else if (rem > 1) {
                    this.slots = this.slots.slice(rem)
                }
                this.slots = this.slots
            }

            function bytesToSize(bytes, nFractDigit) {
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes == 0) return 'n/a';
                nFractDigit = nFractDigit !== undefined ? nFractDigit : 0;
                var precision = Math.pow(10, nFractDigit);
                var i = Math.floor(Math.log(bytes) / Math.log(1024));
                return Math.round(bytes * precision / Math.pow(1024, i)) / precision + ' ' + sizes[i];
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
                    sum = 0;
                bucket.push(rate);
                if (bucket.length > bucketSize)
                    bucket.shift();
                for (var i = 0; i < bucket.length; i++) {
                    sum = sum + bucket[i];
                }
                this.rate = (sum / bucket.length).toFixed(2)
                lastTime = stop;
            }
        })()
    }
    var memoryTpl =
        '<div ag-if="memoryEnable" ag-style="{width:memoryWidth}" style="position:fixed;right:0;bottom:0;opacity:0.9;cursor:pointer;">' +
        '  <div style="padding:0 0 3px 3px;text-align:left;background-color:#020;">' +
        '     <div style="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px;">' +
        '         Mem:${heapSize}' +
        '     </div>' +
        '     <div style="position:relative;width:100px;height:30px;overflow:hidden">' +
        '         <span ag-each="slot in slots" ag-style="{\'height\': slot.height, \'margin-top\':30-slot.height, \'background-color\': slot.color, \'width\':memorySlotWidth}" style="float:right;"></span>' +
        '     </div>' +
        '  </div>' +
        '</div>';
    var frameRateTpl =
        '<div ag-style="{width:rateWidth, right: memoryEnable ? memoryWidth : 0}" style="opacity:0.9;cursor:pointer;position:fixed;bottom:0px;">' +
        '   <div style="padding:0 0 3px 3px;text-align:left;background-color:#020;">' +
        '      <div style="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px">' +
        '         Repaint rate: ${rate}/sec' +
        '      </div>' +
        '   </div>' +
        '</div>';

    Monitor.memoryTpl = argilo(memoryTpl).complie(Monitor).bind();
    Monitor.frameRateTpl = argilo(frameRateTpl).complie(Monitor).bind();
    argilo.ready(function() {
        Monitor.memoryTpl.appendTo(document.body)
        Monitor.frameRateTpl.appendTo(document.body)
    })
    Monitor = argilo.proxy(Monitor)

    if (!Monitor.memoryEnable) {
        argilo.logger.warn('totalJSHeapSize === 0... performance.memory is only available in Chrome .')
    } else {
        setInterval(Monitor.updateMomory.bind(Monitor), 1000);
    }
    return Monitor
})()
