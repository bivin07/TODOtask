import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  try {
    // Support query params: page, limit, status
    const { page = 1, limit = 0, status } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(0, parseInt(limit, 10) || 0);

    // Build filter object
    const filter = {};
    if (status) {
      filter.status = status;
    }

    // Count total matching documents
    const totalItems = await Todo.countDocuments(filter);

    // Build query with optional pagination
    let query = Todo.find(filter).sort({ createdAt: -1 });
    if (limitNum > 0) {
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const todos = await query.exec();

    // Derive pagination info
    const itemsPerPage = limitNum > 0 ? limitNum : totalItems;
    const totalPages = Math.max(1, Math.ceil((totalItems || 0) / (itemsPerPage || 1)));

    // Respond with a normalized shape expected by the client
    res.status(200).json({
      data: todos,
      pagination: {
        currentPage: pageNum,
        itemsPerPage,
        totalItems,
        totalPages,
      },
    });
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


