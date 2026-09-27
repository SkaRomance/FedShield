import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem("fedshield_session");
      localStorage.removeItem("fedshield_active_view");
      if (typeof window !== "undefined") {
        window.location.hash = "";
      }
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "#0f172a",
            color: "#f8fafc",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: 520,
              width: "100%",
              background: "#1e293b",
              borderRadius: 12,
              padding: 32,
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              border: "1px solid #334155",
            }}
          >
            <h1 style={{ fontSize: 20, marginBottom: 12, color: "#ef4444" }}>
              Si è verificato un problema di caricamento
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
              L&apos;applicazione ha riscontrato un errore inaspettato durante il rendering.
            </p>
            {this.state.error && (
              <pre
                style={{
                  background: "#090d16",
                  color: "#fca5a5",
                  padding: 12,
                  borderRadius: 8,
                  fontSize: 12,
                  overflowX: "auto",
                  marginBottom: 24,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 6,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Ricarica pagina
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 6,
                  background: "#475569",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Ripristina e accedi
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
