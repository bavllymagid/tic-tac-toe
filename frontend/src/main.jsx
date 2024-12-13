import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SnackbarProvider } from "notistack";

import "./index.css";
import { Router } from "./router/Router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SnackbarProvider
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
    >
      <Router />
    </SnackbarProvider>
  </StrictMode>
);
