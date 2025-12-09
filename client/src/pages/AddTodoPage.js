
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TodoForm from "../components/TodoForm.js";
import { createTodo } from "../reducers/slices/todoSlice.js";

const AddTodoPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      const action = await dispatch(createTodo(data));
      if (createTodo.rejected.match(action)) {
        throw new Error(action.payload || "Failed to create todo.");
      }
      toast.success("Todo created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Add New Todo
        </h1>
        <TodoForm
          submitLabel="Create Todo"
          onSubmit={handleSubmit}
          onCancel={() => navigate("/")}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AddTodoPage;