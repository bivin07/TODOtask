import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage.js";
import AddTodoPage from "../pages/AddTodoPage.js";
import EditTodoPage from "../pages/EditTodoPage.js";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddTodoPage />} />
        <Route
          path="/edit/:id"
          element={<EditTodoPage />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
