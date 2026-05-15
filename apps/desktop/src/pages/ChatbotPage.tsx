import { useState, useRef, useEffect, useMemo } from "react";
import { chatbotQuery } from "../api";
import { renderAssistantMarkdown } from "../lib/markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatbotPageProps {
  token: string;
}

export default function ChatbotPage({ token }: ChatbotPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;
    setError(null);

    const userMsg: Message = {
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await chatbotQuery(token, { question, history });
      const assistantMsg: Message = {
        role: "assistant",
        content: res.answer,
        timestamp: res.timestamp,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Errore di comunicazione con il chatbot.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ ${errMsg}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chatbot-page" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2>🤖 AI AuditBot </h2>
      </div>
      <p>Consulente AI a disposizione del consulente HSE: normative, sanzioni, ispezioni, DPI e formazione.</p>
      {error && <div className="status-message" style={{ color: "var(--color-error)" }}>{error}</div>}

      <div
        className="chat-messages"
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          padding: 16,
          marginTop: 12,
          background: "var(--color-surface)",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "var(--color-text-muted)" }}>
            Scrivi una domanda per iniziare, ad esempio:
            <br />
            • "Cosa dice il D.Lgs. 81 sull’uso dei DPI?"
            <br />
            • "Quali sanzioni per mancanza DVR?"
            <br />
            • "Aiutami a redigere una dichiarazione di conformità"
          </p>
        )}
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 4, padding: 8 }}>
            <span>🤖 sta scrivendo...</span>
            <span className="spinner">...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scrivi la tua domanda..."
          style={{ flex: 1 }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="btn-primary"
        >
          Invia
        </button>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const sanitizedHtml = useMemo(
    () => (isUser ? null : renderAssistantMarkdown(message.content)),
    [isUser, message.content],
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          padding: "10px 14px",
          borderRadius: 12,
          background: isUser ? "var(--color-accent)" : "var(--color-surface-muted)",
          color: isUser ? "var(--color-on-primary)" : "var(--color-text)",
          border: isUser ? "none" : "1px solid var(--color-border)",
          boxShadow: "var(--shadow-xs)",
          wordBreak: "break-word",
        }}
      >
        <strong>{isUser ? "Tu" : "AI"}</strong>
        {isUser ? (
          <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{message.content}</div>
        ) : (
          <div
            className="chatbot-md"
            style={{ marginTop: 4 }}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml ?? "" }}
          />
        )}
        <small style={{ opacity: 0.6, display: "block", marginTop: 4 }}>
          {new Date(message.timestamp).toLocaleTimeString("it-IT")}
        </small>
      </div>
    </div>
  );
}
