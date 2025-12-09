import Todo from "../models/Todo.js";

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found." });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};