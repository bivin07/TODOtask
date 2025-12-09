import Todo from "../models/Todo.js";

export const createTodo = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required." });
    }  
    const todo = new Todo({ title, description, status });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};