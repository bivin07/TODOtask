import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../config/apiClient.js";

const initialState = {
  todos: [],
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
  currentTodo: null,
  pagination: {
    currentPage: 1,
    itemsPerPage: 6,
    totalItems: 0,
    totalPages: 1
  }
};

const normalizePagination = (state, payload = {}) => {
  const paginationData = payload.pagination || {};
  const currentPage =
    paginationData.currentPage ?? payload.page ?? state.pagination.currentPage;
  const itemsPerPage =
    paginationData.itemsPerPage ?? payload.limit ?? state.pagination.itemsPerPage;
  const totalItems =
    paginationData.totalItems ?? payload.total ?? state.pagination.totalItems;

  const totalPages =
    paginationData.totalPages ??
    payload.totalPages ??
    Math.max(1, Math.ceil((totalItems || 0) / (itemsPerPage || 1)));

  state.pagination = {
    ...state.pagination,
    ...paginationData,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
  };
};

// Thunks
export const fetchTodos = createAsyncThunk(
  "todo/fetchTodos",
  async ({ page = 1, limit = 6, status }, thunkAPI) => {
    try {
      const response = await apiClient.get("/get-todo", {
        params: { page, limit, status },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch todos."
      );
    }
  }
);

export const fetchTodoById = createAsyncThunk(
  "todo/fetchTodoById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch todo."
      );
    }
  }
);

export const createTodo = createAsyncThunk(
  "todo/createTodo",
  async (data, thunkAPI) => {
    try {
      const response = await apiClient.post("/create-todo", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create todo."
      );
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todo/updateTodo",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/update-todo/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update todo."
      );
    }
  }
);

export const removeTodo = createAsyncThunk(
  "todo/removeTodo",
  async (id, thunkAPI) => {
    try {
      await apiClient.delete(`/delete-todo/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete todo."
      );
    }
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodos: (state, action) => {
      const payload = action.payload || {};
      state.todos = payload.data || payload;

      // Normalize pagination whether it comes as "pagination" or top-level props
      const paginationData = payload.pagination || {};
      const currentPage = paginationData.currentPage ?? payload.page ?? state.pagination.currentPage;
      const itemsPerPage = paginationData.itemsPerPage ?? payload.limit ?? state.pagination.itemsPerPage;
      const totalItems = paginationData.totalItems ?? payload.total ?? state.pagination.totalItems;

      // Prefer provided totalPages, otherwise derive it to keep the UI in sync
      const totalPages =
        paginationData.totalPages ??
        payload.totalPages ??
        Math.max(1, Math.ceil((totalItems || 0) / (itemsPerPage || 1)));

      state.pagination = {
        ...state.pagination,
        ...paginationData,
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages
      };
    },
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    },
    addTodo: (state, action) => {
      state.todos.push(action.payload);
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        // Support APIs that return { data: [...], pagination: {...} }
        // as well as simpler APIs that return an array directly.
        if (Array.isArray(payload)) {
          state.todos = payload;
          // If backend doesn't provide pagination info, derive basic totals
          state.pagination.totalItems = payload.length;
          state.pagination.totalPages = Math.max(
            1,
            Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage)
          );
        } else {
          state.todos = payload.data || [];
          normalizePagination(state, payload);
        }
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchTodoById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentTodo = null;
      })
      .addCase(fetchTodoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTodo = action.payload;
      })
      .addCase(fetchTodoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createTodo.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.creating = false;
        state.todos = [action.payload, ...state.todos];
        state.currentTodo = action.payload;
        state.pagination.totalItems += 1;
        state.pagination.totalPages = Math.max(
          1,
          Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage)
        );
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateTodo.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.updating = false;
        state.todos = state.todos.map((todo) =>
          todo._id === action.payload._id ? action.payload : todo
        );
        state.currentTodo = action.payload;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(removeTodo.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.deleting = false;
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
        state.pagination.totalPages = Math.max(
          1,
          Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage)
        );
      })
      .addCase(removeTodo.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { 
  setTodos, 
  addTodo, 
  deleteTodo, 
  setLoading, 
  setError,
  setPagination 
} = todoSlice.actions;

export default todoSlice.reducer;
