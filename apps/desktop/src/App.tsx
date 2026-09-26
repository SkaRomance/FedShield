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
import { etichettaStatoLicenza } from "./lib/etichette";
import { formattaOra } from "./lib/oraItalia";
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

  const [syncMessage, setSyncMessage] = useState("Sincronizzazione non ancora avviata.");
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
        setLicenseError(error instanceof Error ? error.message : "Errore di licenza del dispositivo");
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
    setSyncMessage("Sessione scaduta. Esegui di nuovo l'accesso.");
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
        setSyncMessage("Licenza del dispositivo non attiva: sincronizzazione sospesa.");
        return;
      }

      const [push, pull] = await Promise.all([flushSyncQueue(token), pullAndAcknowledge(token)]);
      setSyncQueueSize(getSyncQueueSize());
      setSyncMessage(
        `Sincronizzazione riuscita alle ${formattaOra(new Date())}: inviate ${push.pushed}, già presenti ${push.duplicates}, ricevute ${pull.received}.`,
      );

      // Refresh rapido per allineare la UI con i delta appena ricevuti.
      await loadDashboard(token);
    } catch (error) {
      if (handleUnauthorizedSession(error)) {
        return;
      }
      setSyncQueueSize(getSyncQueueSize());
      setSyncMessage(
        `Sincronizzazione non riuscita: ${error instanceof Error ? error.message : "errore"}`,
      );
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
    setSyncMessage("Sincronizzazione non ancora avviata.");
  }

  if (licenseLoading) {
    return <div className="app-screen-msg">Verifica della licenza del dispositivo in corso…</div>;
  }

  if (licenseError) {
    return <div className="app-screen-error">Errore di licenza: {licenseError}</div>;
  }

  if (deviceContext && !deviceContext.isActive && !deviceContext.isWithinGrace) {
    return <div className="app-screen-error">
        Licenza del dispositivo non attiva. Stato: {etichettaStatoLicenza(deviceContext.status)}.
      </div>;
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
