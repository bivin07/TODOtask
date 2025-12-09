import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchTodos,
  removeTodo,
  setPagination,
  createTodo,
  updateTodo,
} from "../reducers/slices/todoSlice.js";
import { ClipLoader } from "react-spinners";
import { Plus } from "lucide-react";
import Pagination from "../components/Pagination.js";
import Modal from "../components/Modal.js";
import TodoForm from "../components/TodoForm.js";
import TodoCard from "../components/TodoCard.js";

const HomePage = () => {
  const dispatch = useDispatch();
  const { todos, pagination } = useSelector((state) => state.todo);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadTodos = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const status = filter === "all" ? undefined : filter;
      const action = await dispatch(fetchTodos({ page, limit: 6, status }));
      if (fetchTodos.rejected.match(action)) {
        throw new Error(action.payload || "Failed to fetch todos.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch, filter]);

  useEffect(() => {
    loadTodos(pagination.currentPage);
  }, [loadTodos, pagination.currentPage]);

  const openAddModal = useCallback(() => {
    setModalMode("add");
    setSelectedTodo({ title: "", description: "", status: "pending" });
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((todo) => {
    setModalMode("edit");
    setSelectedTodo(todo);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      dispatch(
        setPagination({
          ...pagination,
          currentPage: newPage,
        })
      );
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    dispatch(
      setPagination({
        ...pagination,
        currentPage: 1,
      })
    );
  };

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        const action = await dispatch(removeTodo(id));
        if (removeTodo.rejected.match(action)) {
          throw new Error(action.payload || "Failed to delete todo.");
        }
        toast.success("Todo deleted successfully.");
      } catch (error) {
        toast.error(error.message);
      }
    }
  }, [dispatch]);

  const handleFormSubmit = async (data) => {
    try {
      setFormLoading(true);
      if (modalMode === "add") {
        const action = await dispatch(createTodo(data));
        if (createTodo.rejected.match(action)) {
          throw new Error(action.payload || "Failed to create todo.");
        }
        toast.success("Todo created successfully!");
        dispatch(
          setPagination({
            ...pagination,
            currentPage: 1,
          })
        );
        loadTodos(1);
      } else if (modalMode === "edit" && selectedTodo?._id) {
        const action = await dispatch(
          updateTodo({ id: selectedTodo._id, data })
        );
        if (updateTodo.rejected.match(action)) {
          throw new Error(action.payload || "Failed to update todo.");
        }
        toast.success("Todo updated successfully!");
        loadTodos(pagination.currentPage);
      }
      closeModal();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Todo List</h1>
            <p className="text-gray-500 mt-1">Manage your tasks</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "pending", "in-progress", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === status
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <ClipLoader size={50} color="#3b82f6" />
            <p className="mt-4 text-gray-500">Loading...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No tasks found</p>
            <button
              onClick={openAddModal}
              className="mt-4 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Your First Task
            </button>
          </div>
        ) : (
          <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
             
                {(() => {
                  const itemsPerPage = pagination.itemsPerPage || 6;
                  const currentPage = pagination.currentPage || 1;
                  const start = (currentPage - 1) * itemsPerPage;
                  const end = start + itemsPerPage;

                  let displayed = todos;
                  if (Array.isArray(todos) && pagination.totalItems === todos.length) {
                    displayed = todos.slice(start, end);
                  }

                  return displayed.map((todo) => (
                    <TodoCard
                      key={todo._id}
                      todo={todo}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                    />
                  ));
                })()}
              </div>

            <div className="flex justify-center">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === "add" ? "Add Todo" : "Edit Todo"}
      >
        <TodoForm
          initialData={selectedTodo || undefined}
          submitLabel={modalMode === "add" ? "Create Todo" : "Update Todo"}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default HomePage;