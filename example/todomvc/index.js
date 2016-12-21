argilo.ready(function() {
  argilo({
      template: document.getElementById('tpl/todo.html').innerHTML,
      controller: {
        state: {
          completedNum: 0,
          edited: undefined
        },
        created: function() {
          var completedNum = 0
          argilo.each(this.scope.todos, function(todo) {
            if (todo.complated)
              completedNum++
          })
          this.state.completedNum = completedNum
        },
        addTodo: function(scope, el) {
          var val = argilo.trim(argilo.val(el));
          argilo.val(el, '');
          argilo.focus(el);
          if (!val) return;
          this.scope.todos.splice(0, 0, {
            title: val,
            completed: false
          })
        },
        editTodo: function(todo) {
          this.state.edited = todo
        },
        updateTodo: function(todo) {
          if (!argilo.trim(todo.title))
            this.removeTodo(todo)
          this.state.edited = undefined
        },
        removeTodo: function(todo) {
          var idx = argilo.indexOf(this.scope.todos, todo);
          if (idx != -1) {
            this.scope.todos.splice(idx, 1);
            if (todo.completed)
              this.state.completedNum--;
            this.scope.todos = this.scope.todos
          }
        },
        toggleAll: function() {
          var completedNum = this.state.completedNum,
            todos = this.scope.todos,
            done = completedNum != todos.length
          argilo.$each(todos, function(todo) {
            if (todo.completed != done)
              done ? completedNum++ : completedNum--;
            todo.completed = done
          })
          this.state.completedNum = completedNum
        },
        toggle: function(todo) {
          todo.completed = !todo.completed;
          todo.completed ? this.state.completedNum++ : this.state.completedNum--;
        },
        clear: function() {
          argilo.$each(this.scope.todos, function(todo) {
            todo.completed = false;
          })
          this.state.completedNum = 0;
        },
        display: function(visibility, completed) {
          console.log(visibility, completed)
          switch (visibility) {
            case 'all':
              return true;
            case 'active':
              return !completed
            case 'completed':
              return completed
          }
        }
      }
    })
    .compile({
      todos: []
    }, {
      title: 'Todo MVC',
      visibility: 'all'
    }).appendTo('.todoapp')
})
