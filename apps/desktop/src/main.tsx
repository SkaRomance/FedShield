import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles.css";

// Rimuove qualsiasi traccia residua di tema scuro dal browser o dal DOM
try {
  if (typeof document !== "undefined") {
    document.documentElement.removeAttribute("data-theme");
  }
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("fedshield-theme");
  }
} catch {
  // best-effort
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

