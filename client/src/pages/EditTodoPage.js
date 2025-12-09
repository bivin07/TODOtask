import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import TodoForm from "../components/TodoForm.js";
import {
  fetchTodoById,
  updateTodo,
} from "../reducers/slices/todoSlice.js";

const EditTodoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTodo, loading, updating } = useSelector((state) => state.todo);

  useEffect(() => {
    dispatch(fetchTodoById(id)).then((action) => {
      if (fetchTodoById.rejected.match(action)) {
        toast.error(action.payload || "Failed to fetch todo.");
      }
    });
  }, [dispatch, id]);

  const handleSubmit = async (data) => {
    try {
      const action = await dispatch(updateTodo({ id, data }));
      if (updateTodo.rejected.match(action)) {
        throw new Error(action.payload || "Failed to update todo.");
      }
      toast.success("Todo updated successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Edit Todo
        </h1>
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          <TodoForm
            initialData={currentTodo || undefined}
            submitLabel="Update Todo"
            onSubmit={handleSubmit}
            onCancel={() => navigate("/")}
            loading={updating}
          />
        )}
      </div>
    </div>
  );
};

export default EditTodoPage;
