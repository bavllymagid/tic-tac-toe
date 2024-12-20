import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SnackbarProvider } from "notistack";
import { store } from "./store";
import "./index.css";
import { Router } from "./router/Router";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
    <SnackbarProvider 
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
    >
      <Router />
    </SnackbarProvider>
    </Provider>
  </StrictMode>
);
