const express = require("express");
const checkAuth = require("../middleware/check-auth");
const TodoController = require('../controllers/todo');
const router = express.Router();

router.post("", checkAuth, TodoController.createTodo);

router.put("/:id", checkAuth, TodoController.updateTodo);

router.get("", TodoController.getTodos);

router.get("/:id", TodoController.getTodo);

router.delete("/:id", checkAuth, TodoController.deleteTodo);

module.exports = router;
