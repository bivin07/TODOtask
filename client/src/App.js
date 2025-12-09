import React from "react";
import { Provider } from "react-redux";
import store from "./reducers/store/store.js";
import AppRoutes from "./routes/AppRoutes.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <ToastContainer />
      <AppRoutes />
    </Provider>
  );
}

export default App;
