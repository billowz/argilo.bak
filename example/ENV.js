var ENV = (function() {

  function lpad(str, padding, toLength) {
    return padding.repeat((toLength - str.length) / padding.length).concat(str);
  }

  function mutations(value) {
    if (value)
      env.mutationsValue = value;
    return env.mutationsValue;
  }

  function formatElapsed(value) {
    var str = parseFloat(value).toFixed(2);
    if (value > 60) {
      minutes = Math.floor(value / 60);
      comps = (value % 60).toFixed(2).split('.');
      seconds = lpad(comps[0], '0', 2);
      ms = comps[1];
      str = minutes + ":" + seconds + "." + ms;
    }
    return str;
  }

  function getElapsedClassName(elapsed) {
    var className = 'Query elapsed';
    if (elapsed >= 10.0) {
      className += ' warn_long';
    } else if (elapsed >= 1.0) {
      className += ' warn';
    } else {
      className += ' short';
    }
    return className;
  }

  function countClassName(queries) {
    var countClassName = "label";
    if (queries >= 20) {
      countClassName += " label-important";
    } else if (queries >= 10) {
      countClassName += " label-warning";
    } else {
      countClassName += " label-success";
    }
    return countClassName;
  }

  function updateQuery(object) {
    if (!object)
      object = {};
    var elapsed = Math.random() * 15;
    object.elapsed = elapsed;
    object.formatElapsed = formatElapsed(elapsed);
    object.elapsedClassName = getElapsedClassName(elapsed);
    object.query = "SELECT blah FROM something";
    object.waiting = Math.random() < 0.5;
    if (Math.random() < 0.2) {
      object.query = "<IDLE> in transaction";
    }
    if (Math.random() < 0.1) {
      object.query = "vacuum";
    }
    return object;
  }

  function cleanQuery(value) {
    if (value) {
      value.formatElapsed = "";
      value.elapsedClassName = "";
      value.query = "";
      value.elapsed = null;
      value.waiting = null;
    } else {
      return {
        query: "***",
        formatElapsed: "",
        elapsedClassName: ""
      };
    }
  }

  function generateRow(object, keepIdentity, counter) {
    var nbQueries = Math.floor((Math.random() * 10) + 1);
    if (!object) object = {};

    object.lastMutationId = counter;
    object.nbQueries = nbQueries;

    if (!object.lastSample)
      object.lastSample = {};

    if (!object.lastSample.topFiveQueries)
      object.lastSample.topFiveQueries = [];

    if (keepIdentity) {
      if (!object.lastSample.queries) {
        object.lastSample.queries = [];
        for (var l = 0; l < 12; l++) {
          object.lastSample.queries.push(cleanQuery());
        }
      }
      argilo.$each(object.lastSample.queries, function(value, j) {
        if (j <= nbQueries) {
          updateQuery(value);
        } else {
          cleanQuery(value);
        }
      })
    } else {
      object.lastSample.queries = [];
      for (var j = 0; j < 12; j++) {
        if (j < nbQueries) {
          object.lastSample.queries.push(updateQuery(cleanQuery()));
        } else {
          object.lastSample.queries.push(cleanQuery());
        }
      }
    }
    for (var i = 0; i < 5; i++) {
      object.lastSample.topFiveQueries[i] = object.lastSample.queries[i];
    }
    object.lastSample.nbQueries = nbQueries;
    object.lastSample.countClassName = countClassName(nbQueries);
    return object;
  }

  var counter = 0

  function generate(keepIdentity) {
    var oldData = env.data;

    if (!keepIdentity || !env.data) {
      env.data = [];
      oldData = env.data
    }
    if (env.data.length > ENV.rows * 2) {
      env.data = env.data.slice(0, ENV.rows * 2)
    } else {
      for (var i = env.data.length / 2 + 1; i <= ENV.rows; i++) {
        env.data.push({
          dbname: 'cluster' + i,
          query: "",
          formatElapsed: "",
          elapsedClassName: ""
        });
        env.data.push({
          dbname: 'cluster' + i + ' slave',
          query: "",
          formatElapsed: "",
          elapsedClassName: ""
        });
      }
    }
    argilo.$each(env.data, function(row, i) {
      if (!keepIdentity && oldData && oldData[i])
        row.lastSample = oldData[i].lastSample;

      if (!row.lastSample || Math.random() < mutations()) {
        counter++;
        if (!keepIdentity)
          row.lastSample = null;
        generateRow(row, keepIdentity, counter);
      } else {
        env.data[i] = oldData[i];
      }
    })
    first = false;
    return env.data
  }

  var tpl =
    '<div style="display: flex;">' +
    '  <label>mutations: {(mutationsValue * 100).toFixed(0)}%</label>' +
    '  <input type="range" ag-onchange="change" style="margin-bottom: 10px; margin-top: 5px" />' +
    '</div>' +
    '<div><label>rows:</label><input type="text" ag-input="rows" ag-value="rows" style="margin-left:10px"/></div>'
  var env = {
    data: null,
    mutationsValue: 0.5,
    rows: 10,
    generate: generate,
    mutations: mutations,
    timeout: 0,
    change: function(scope, el) {
      scope.mutationsValue = argilo.val(el) / 100
    }
  }
  argilo.ready(function() {
    argilo(tpl).complie(env).before(document.body.firstChild)
    env = argilo.proxy(env)
  })
  return env
})()
