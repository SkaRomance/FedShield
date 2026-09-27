import { FormEvent, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

interface LoginPageProps {
  loading: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
}

const DEV_DEFAULTS = import.meta.env.DEV
  ? { email: "admin@fedshield.local", password: "fedshield123" }
  : { email: "", password: "" };

const LOGHI_ACCESSO = [
  "/fedshield-logo-clean.png",
  "/fedshield-logo.png",
  "/fedshield-logo.jpg",
  "/fedshield-logo.jpeg",
  "/fedshield-logo.webp",
  "/fedshield-logo.svg",
  "/logo.png",
  "/logo.jpg",
];

export default function LoginPage({ loading, onSubmit }: LoginPageProps) {
  const [email, setEmail] = useState(DEV_DEFAULTS.email);
  const [password, setPassword] = useState(DEV_DEFAULTS.password);
  const [error, setError] = useState<string | null>(null);
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoFailed, setLogoFailed] = useState(false);

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
      <div className="login-hero">
        <div className="login-hero-brand">
          {!logoFailed ? (
            <img
              className="login-hero-logo"
              src={LOGHI_ACCESSO[logoIndex]}
              alt="FedInvest - FedShield"
              onError={() => {
                if (logoIndex < LOGHI_ACCESSO.length - 1) {
                  setLogoIndex((current) => current + 1);
                } else {
                  setLogoFailed(true);
                }
              }}
            />
          ) : (
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--navy-900)" }}>
              FedInvest
            </span>
          )}
        </div>

        <div className="login-hero-content">
          <h2 className="login-hero-tagline">La sicurezza che lavora con te.</h2>
          <p className="login-hero-subtagline">
            Piattaforma antisanzione integrata per la gestione HSE, audit operativi e conformità normativa continua.
          </p>
        </div>

        <div className="login-hero-footer">
          <span>FedInvest Group · Soluzioni integrate per la sicurezza aziendale</span>
        </div>
      </div>

      <div className="login-form-pane">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-brand-mark">
            <ShieldCheck size={26} aria-hidden="true" />
          </div>
          <h1>FedShield</h1>
          <p>Accedi alla piattaforma antisanzione</p>

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
            Versione 1.0 · Sicurezza e igiene sul lavoro
          </p>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
