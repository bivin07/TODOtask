import React, { memo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const statusClasses = {
  completed: "bg-green-100 text-green-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  pending: "bg-red-100 text-red-800",
};

const TodoCard = ({ todo, onEdit, onDelete }) => {
  const badgeClass = statusClasses[todo.status] || statusClasses.pending;

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">{todo.title}</h3>
      <p className="text-gray-600 mt-2">{todo.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className={`px-2 py-1 text-sm rounded ${badgeClass}`}>
          {todo.status}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => onEdit?.(todo)}
            className="text-blue-500 hover:text-blue-700"
            aria-label="Edit todo"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete?.(todo._id)}
            className="text-red-500 hover:text-red-700"
            aria-label="Delete todo"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(TodoCard);

