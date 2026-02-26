import { FormEvent, useState } from "react";

interface LoginPageProps {
  loading: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
}

export default function LoginPage({ loading, onSubmit }: LoginPageProps) {
  const [email, setEmail] = useState("admin@fedshield.local");
  const [password, setPassword] = useState("fedshield123");
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
        <h1>FedShield</h1>
        <p>Accesso piattaforma antisanzione</p>

        <label>Email</label>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />

        <label>Password</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          required
          minLength={8}
        />

        {error && <div className="error-box">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Accesso..." : "Entra"}
        </button>
      </form>
    </div>
  );
}
