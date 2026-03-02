import { useEffect, useState } from "react";
import {
  apiLogin,
  Company,
  fetchCompanies,
  fetchInspections,
  Inspection,
  isUnauthorizedError,
  LoginResponse,
} from "./api";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import {
  DeviceContext,
  ensureLicenseActivation,
  flushSyncQueue,
  getSyncQueueSize,
  pullAndAcknowledge,
  sendLicenseHeartbeat,
} from "./services/syncManager";

type SessionState = LoginResponse | null;

export default function App() {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<SessionState>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);

  const [licenseLoading, setLicenseLoading] = useState(true);
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [deviceContext, setDeviceContext] = useState<DeviceContext | null>(null);

  const [syncMessage, setSyncMessage] = useState("Sync non avviata.");
  const [syncQueueSize, setSyncQueueSize] = useState(0);

  useEffect(() => {
    const persisted = localStorage.getItem("fedshield_session");
    if (persisted) {
      try {
        setSession(JSON.parse(persisted) as LoginResponse);
      } catch {
        localStorage.removeItem("fedshield_session");
      }
    }

    ensureLicenseActivation()
      .then((context) => {
        setDeviceContext(context);
        setSyncQueueSize(getSyncQueueSize());
      })
      .catch((error) => {
        setLicenseError(error instanceof Error ? error.message : "Errore licenza device");
      })
      .finally(() => {
        setLicenseLoading(false);
      });
  }, []);

  function clearSessionState() {
    setSession(null);
    setCompanies([]);
    setInspections([]);
    localStorage.removeItem("fedshield_session");
  }

  function handleUnauthorizedSession(error: unknown): boolean {
    if (!isUnauthorizedError(error)) {
      return false;
    }
    clearSessionState();
    setSyncQueueSize(getSyncQueueSize());
    setSyncMessage("Sessione scaduta o token non valido. Effettua di nuovo il login.");
    return true;
  }

  async function loadDashboard(token: string) {
    try {
      const [companiesData, inspectionsData] = await Promise.all([fetchCompanies(token), fetchInspections(token)]);
      setCompanies(companiesData);
      setInspections(inspectionsData);
    } catch (error) {
      if (handleUnauthorizedSession(error)) {
        return;
      }
      throw error;
    }
  }

  async function runSyncCycle(token: string) {
    try {
      const context = await sendLicenseHeartbeat();
      setDeviceContext(context);

      if (!context.isActive && !context.isWithinGrace) {
        setSyncMessage("Licenza device non attiva. Sync bloccata.");
        return;
      }

      const [push, pull] = await Promise.all([flushSyncQueue(token), pullAndAcknowledge(token)]);
      setSyncQueueSize(getSyncQueueSize());
      setSyncMessage(`Sync OK: push ${push.pushed}/${push.duplicates}, pull ${pull.received}`);

      // Refresh rapido per allineare la UI con i delta appena ricevuti.
      await loadDashboard(token);
    } catch (error) {
      if (handleUnauthorizedSession(error)) {
        return;
      }
      setSyncQueueSize(getSyncQueueSize());
      setSyncMessage(`Sync in errore: ${error instanceof Error ? error.message : "errore"}`);
    }
  }

  useEffect(() => {
    if (!session) return;

    loadDashboard(session.token).catch((error) => {
      console.error(error);
    });

    runSyncCycle(session.token).catch((error) => {
      console.error(error);
    });

    const timer = setInterval(() => {
      runSyncCycle(session.token).catch((error) => {
        console.error(error);
      });
    }, 90_000);

    return () => clearInterval(timer);
  }, [session]);

  async function handleLogin(email: string, password: string) {
    setLoading(true);
    try {
      const response = await apiLogin(email, password);
      setSession(response);
      localStorage.setItem("fedshield_session", JSON.stringify(response));
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearSessionState();
    setSyncMessage("Sync non avviata.");
  }

  if (licenseLoading) {
    return <div className="app-screen-msg">Verifica licenza device in corso...</div>;
  }

  if (licenseError) {
    return <div className="app-screen-error">Errore licenza: {licenseError}</div>;
  }

  if (deviceContext && !deviceContext.isActive && !deviceContext.isWithinGrace) {
    return <div className="app-screen-error">Licenza dispositivo non attiva. Stato: {deviceContext.status ?? "sconosciuto"}.</div>;
  }

  if (!session) {
    return <LoginPage loading={loading} onSubmit={handleLogin} />;
  }

  return (
    <DashboardPage
      token={session.token}
      user={session.user}
      companies={companies}
      inspections={inspections}
      syncStatus={{
        message: syncMessage,
        queueSize: syncQueueSize,
        deviceStatus: deviceContext?.status,
      }}
      onReload={() => loadDashboard(session.token)}
      onSyncNow={() => runSyncCycle(session.token)}
      onLogout={handleLogout}
    />
  );
}
