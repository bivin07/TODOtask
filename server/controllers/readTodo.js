import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;  // Extract ID from request parameters
    const todo = await Todo.findById(id);  // Find the Todo by ID

    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });  // If no Todo is found
    }

    res.status(200).json(todo);  // Return the found Todo
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
}; 


