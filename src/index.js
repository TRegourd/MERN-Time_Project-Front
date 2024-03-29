import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import { SnackbarProvider } from "notistack";
import GirdDataProvider from "./GridDataProvider";
import { ConfirmProvider } from "material-ui-confirm";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GirdDataProvider>
          <ConfirmProvider>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </ConfirmProvider>
        </GirdDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
