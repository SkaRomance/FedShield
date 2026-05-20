import { useEffect, useState } from "react";
import { API_BASE } from "../api";

export function useNotificationBadge(token: string) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/notifications/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore caricamento notifiche");
      const data = await res.json();
      setCount((data.summary?.red || 0) + (data.summary?.orange || 0));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 5 * 60 * 1000); // ogni 5 min
    return () => clearInterval(timer);
  }, [token]);

  return { count, loading, error, refresh: load };
}
