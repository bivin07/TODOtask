import express from "express";
import { createTodo } from "../controllers/createTodo.js";
import { getTodoById, getTodos } from "../controllers/readTodo.js";
import { updateTodo } from "../controllers/updateTodo.js";
import { deleteTodo } from "../controllers/deleteTodo.js";

const router = express.Router();

router.post("/create-todo", createTodo);
router.get("/get-todo", getTodos);
router.get("/get-by-id/:id", getTodoById);
router.put("/update-todo/:id", updateTodo);
router.delete("/delete-todo/:id", deleteTodo);

export default router;
