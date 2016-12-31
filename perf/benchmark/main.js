(function() {

  function _random(max) {
    return Math.round(Math.random() * 1000) % max;
  }

  var startTime;
  var lastMeasure;
  var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
  }
  var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
      window.setTimeout(function() {
        lastMeasure = null;
        var stop = performance.now();
        console.log(last + " took " + (stop - startTime));
      }, 0);
    }
  }
  var id = 1
  var start = performance.now()
  var compontent = argilo({
    template: '#templ',
    controller: {
      rows: undefined,
      selected: undefined,
      init: function() {
        this.rows = []
          /*setTimeout(function() {

          }.bind(this), 30)*/
      },
      buildrows: function(count) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var rows = [];
        count = count || 1000
        for (var i = 0; i < count; i++)
          rows.push({
            id: id++,
            label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
          });
        return rows;
      },
      updaterows: function(mod) {
        mod = mod || 10
        this.rows = argilo.$map(this.rows, function(r, i) {
          if (i % mod === 0) {
            return argilo.$assign({}, r, {
              label: r.label + ' !!!'
            })
          }
          return r
        })
      },
      add: function() {
        //01_run1k/08_create1k-after10k
        startMeasure("add");
        this.rows = this.rows.concat(this.buildrows(1000))
        stopMeasure();
      },
      delete: function(id) {
        //06_remove-one-1k
        startMeasure("remove");
        const idx = argilo.findIndex(this.rows, d => d.id == id);
        this.rows.splice(idx, 1)
        stopMeasure();
      },
      select: function(id) {
        //04_select1k
        startMeasure("select");
        this.selected = id;
        stopMeasure();
      },
      run: function() {
        //02_replace1k
        startMeasure("run");
        this.rows = this.buildrows();
        this.selected = undefined;
        stopMeasure();
      },
      update: function() {
        //03_update10th1k
        startMeasure("update");
        this.updaterows();
        stopMeasure();
      },
      runLots: function() {
        //07_create10k/
        startMeasure("runLots");
        this.rows = this.buildrows(10000);
        this.selected = undefined;
        stopMeasure();
      },
      clear: function() {
        //09_clear10k/10_clear-2nd-time10k
        startMeasure("clear");
        this.rows = [];
        this.selected = undefined;
        stopMeasure();
      },
      swapRows: function() {
        //05_swap1k
        startMeasure("swapRows");
        if (this.rows.length > 10) {
          let d4 = this.rows[4];
          let d9 = this.rows[9];

          this.rows = argilo.map(this.rows, function(row, i) {
            if (i === 4) {
              return d9;
            } else if (i === 9) {
              return d4;
            }
            return row
          })
        }
        stopMeasure();
      }
    }
  })

  //console.log('compile compontent use ', performance.now() - start)
  //start = performance.now()

  var view = compontent.compile({
    rows: [],
    selected: undefined
  })

  //console.log('compile view use ', performance.now() - start)
  //start = performance.now()

  view.appendTo('#main')

  //console.log('mount view use ', performance.now() - start)
})()
