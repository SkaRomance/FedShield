import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";

interface LoginPageProps {
  loading: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
}

const DEV_DEFAULTS = import.meta.env.DEV
  ? { email: "admin@fedshield.local", password: "fedshield123" }
  : { email: "", password: "" };
const LOGO_SRC = `${import.meta.env.BASE_URL || "/"}fedshield-logo-clean.png`;

export default function LoginPage({ loading, onSubmit }: LoginPageProps) {
  const [email, setEmail] = useState(DEV_DEFAULTS.email);
  const [password, setPassword] = useState(DEV_DEFAULTS.password);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await onSubmit(email, password);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Errore non previsto";
      setError(message);
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <img className="login-logo" src={LOGO_SRC} alt="FedShield" />
        <h1>FedShield</h1>
        <p>Accesso piattaforma antisanzione</p>

        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="nome@fedshield.local"
          required
          autoComplete="email"
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          autoComplete="current-password"
        />

        {error && <div className="error-box">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />
              Accesso in corso…
            </span>
          ) : (
            "Entra"
          )}
        </button>

        <p
          style={{
            margin: "20px 0 0",
            fontSize: 12,
            color: "var(--color-text-muted)",
            textAlign: "center",
          }}
        >
          Versione 1.0 · Compliance HSE
        </p>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
