const Todo = require("../models/todo");

exports.createTodo = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const todo = new Todo({
    todo: req.body.todo,
    status: req.body.status,
    subtodo: req.body.subtodo,
    creator: req.userData.userId
  });
  console.log("----",todo);
  todo.save().then(createdTodo => {
    res.status(201).json({
      message: "Todo added successfully",
      todo: {
        ...createdTodo,
        id: createdTodo._id
      }
    });
  })
  .catch(error => {
    res.status(501).json({
      message: 'Creating a todo failed!'
    });
  });
}

exports.updateTodo = (req, res, next) => {
  const todo = new Todo({
    _id: req.body.id,
    todo: req.body.todo,
    status: req.body.status,
    subtodo: req.body.subtodo,
    creator: req.userData.userId
  });
  console.log(todo);
  Todo.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    todo
  ).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Couldnt update Todo!'
    });
  });
}

exports.getTodos = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const todoQuery = Todo.find();
  let fetchedTodos;
  if (pageSize && currentPage) {
    todoQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  todoQuery
    .then(documents => {
      fetchedTodos = documents;
      return Todo.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Todos fetched successfully!",
        todos: fetchedTodos,
        maxTodos: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching todos failed!'
      });
    });
}

exports.getTodo = (req, res, next) => {
  Todo.findById(req.params.id).then(todo => {
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.status(404).json({ message: "Todo not found!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching todo failed!'
    });
  });
}

exports.deleteTodo =  (req, res, next) => {
  Todo.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    }
  )
  .catch(error => {
    res.status(500).json({
      message: 'Deletion failed!'
    });
  });
}
