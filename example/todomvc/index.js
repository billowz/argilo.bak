argilo.ready(function() {
  var todo = {
    edited: null,
    todos: [],
    displayTodos: [],
    completedNum: 0,
    title: 'Todo MVC',
    visibility: 'all',
    filters: {
      all: function(todos) {
        return todos;
      },
      active: function(todos) {
        return argilo.filter(todos, function(todo) {
          return !todo.completed;
        });
      },
      completed: function(todos) {
        return argilo.filter(todos, function(todo) {
          return todo.completed;
        });
      }
    },
    add: function(scope, el) {
      var val = argilo.trim(argilo.val(el));
      argilo.val(el, '');
      if (!val) return;
      /* this.todos.push({
         title: val,
         completed: false
       })*/
      this.todos = this.todos.concat([{
        title: val,
        completed: false
      }]);
      argilo.focus(el);
      this.displayTodos = this.filters[this.visibility](this.todos)
    },
    edit: function(todo) {
      this.edited = todo
    },
    update: function(todo, el) {
      if (!argilo.trim(todo.title)) {
        this.remove(todo);
      }
      this.edited = undefined
    },
    remove: function(todo) {
      var idx = argilo.indexOf(this.todos, todo);
      this.todos.splice(idx, 1);
      if (todo.completed)
        this.completedNum--;
      this.displayTodos = this.filters[this.visibility](this.todos)
    },
    toggleAll: function() {
      var done = this.completedNum != this.todos.length,
        completedNum = this.completedNum;
      argilo.$each(this.displayTodos, function(todo) {
        var t = todo.completed
        if (t !== done) {
          todo.completed = done;
          done ? completedNum++ : completedNum--
        }
      })
      this.completedNum = completedNum;
      this.displayTodos = this.filters[this.visibility](this.todos)
    },
    toggle: function(todo) {
      todo.completed = !todo.completed;
      if (todo.completed) {
        this.completedNum++;
      } else {
        this.completedNum--;
      }
      this.displayTodos = this.filters[this.visibility](this.todos)
    },
    clear: function() {
      argilo.$each(this.todos, function(todo) {
        todo.completed = false;
      })
      this.completedNum = 0;
      this.displayTodos = this.filters[this.visibility](this.todos)
    },
    vis: function(type) {
      if (this.visibility !== type) {
        this.visibility = type
        this.displayTodos = this.filters[type](this.todos)
      }
    }
  }

  var todoTpl = argilo(document.getElementById('tpl/todo.html').innerHTML)
    .complie(todo).appendTo('.todoapp')

})
