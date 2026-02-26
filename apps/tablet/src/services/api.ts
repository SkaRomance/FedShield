export interface LoginResult {
  token: string;
}

export interface Company {
  id: string;
  name: string;
  vatNumber: string;
  atecoCode?: string;
}

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

export async function login(email: string, password: string): Promise<LoginResult> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login non riuscito");
  }

  return response.json();
}

export async function loadCompanies(token: string): Promise<Company[]> {
  const response = await fetch(`${API_BASE}/companies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Impossibile caricare aziende");
  }

  return response.json();
}
