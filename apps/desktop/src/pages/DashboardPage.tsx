import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  BarChart3,
  ShieldCheck,
  Bot,
  ScrollText,
  RefreshCw,
  LogOut,
  Sun,
  Moon,
  Bell,
} from "lucide-react";
import {
  Company,
  downloadGeneratedDocument,
  generateAttestatoPdf,
  generateInspectionReportPdf,
  Inspection,
} from "../api";
import { queueSyncEvent } from "../services/syncManager";
import { useNotificationBadge } from "../hooks/useNotificationBadge";
import { useTheme } from "../hooks/useTheme";
import ChecklistPage from "./ChecklistPage";
import CustomerRegistryPage from "./CustomerRegistryPage";
import KpiPage from "./KpiPage";
import OdvPage from "./OdvPage";
import QuotesPage from "./QuotesPage";
import ChatbotPage from "./ChatbotPage";
import NormSyncAdminPage from "./NormSyncAdminPage";
import { AssetKind } from "./AssetsPage";
import AssetQrPage from "./AssetQrPage";

interface DashboardProps {
  token: string;
  user: {
    fullName: string;
    role: "junior" | "senior" | "admin";
  };
  companies: Company[];
  inspections: Inspection[];
  syncStatus: {
    message: string;
    queueSize: number;
    deviceStatus?: "active" | "expired" | "revoked";
  };
  onReload: () => Promise<void>;
  onSyncNow: () => Promise<void>;
  onLogout: () => void;
}

const SIDEBAR_LOGO_CANDIDATES = [
  "/fedshield-logo-clean.png",
  "/fedshield-logo.png",
  "/fedshield-logo.jpg",
  "/fedshield-logo.jpeg",
  "/fedshield-logo.webp",
  "/fedshield-logo.svg",
  "/logo.png",
  "/logo.jpg",
];

function roleLabel(role: string): string {
  if (role === "admin") return "Admin";
  if (role === "senior") return "Consulente Senior";
  return "Consulente Junior";
}

function userInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type NavView =
  | "dashboard"
  | "registry"
  | "checklist"
  | "quotes"
  | "kpi"
  | "odv"
  | "chatbot"
  | "normsync"
  | "assetQr";

export default function DashboardPage({
  token,
  user,
  companies,
  inspections,
  syncStatus,
  onReload,
  onSyncNow,
  onLogout,
}: DashboardProps) {
  const [activeView, setActiveView] = useState<NavView>("dashboard");
  const [qrAssetId, setQrAssetId] = useState<string | null>(null);
  const [qrAssetKind, setQrAssetKind] = useState<AssetKind | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [logoIndex, setLogoIndex] = useState(0);
  const [checklistSelection, setChecklistSelection] = useState<{
    companyId?: string;
    inspectionId?: string;
    token: number;
  }>({ token: 0 });

  const { count: alertCount } = useNotificationBadge(token);
  const { theme, toggle: toggleTheme } = useTheme();

  const sanctionableNc = useMemo(
    () =>
      inspections
        .flatMap((item) => item.nonConformities)
        .filter((nc) => nc.isSanctionable).length,
    [inspections],
  );

  async function handleGenerateReportPdf(inspectionId: string) {
    try {
      const generated = await generateInspectionReportPdf(token, inspectionId);
      await downloadGeneratedDocument(token, generated.id, generated.fileName);
      queueSyncEvent({
        eventType: "document.generated",
        entityType: "inspection",
        entityId: inspectionId,
        payload: { kind: "inspection_report" },
      });
      setStatusMessage("Verbale PDF generato e scaricato.");
    } catch (error) {
      setStatusMessage(
        `Errore verbale PDF: ${error instanceof Error ? error.message : "errore"}`,
      );
    }
  }

  async function handleGenerateAttestato(inspectionId: string) {
    try {
      const generated = await generateAttestatoPdf(token, inspectionId);
      await downloadGeneratedDocument(token, generated.id, generated.fileName);
      queueSyncEvent({
        eventType: "document.generated",
        entityType: "inspection",
        entityId: inspectionId,
        payload: { kind: "attestato" },
      });
      setStatusMessage("Attestato PDF generato e scaricato.");
    } catch (error) {
      setStatusMessage(
        `Errore attestato: ${error instanceof Error ? error.message : "errore"}`,
      );
    }
  }

  function handleUseForInspection(companyId: string, inspectionId: string) {
    setChecklistSelection((current) => ({
      companyId,
      inspectionId,
      token: current.token + 1,
    }));
    setActiveView("checklist");
    setStatusMessage("");
  }

  function navItem(view: NavView, label: string, Icon: typeof Users) {
    const active = activeView === view;
    return (
      <button
        className={`nav-item ${active ? "nav-item-active" : ""}`}
        onClick={() => setActiveView(view)}
      >
        <Icon />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <img
            className="brand-logo"
            src={SIDEBAR_LOGO_CANDIDATES[logoIndex]}
            alt="FedShield"
            onError={(event) => {
              if (logoIndex < SIDEBAR_LOGO_CANDIDATES.length - 1) {
                setLogoIndex((current) => current + 1);
              } else {
                event.currentTarget.style.display = "none";
                const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
                if (fallback) {
                  fallback.style.display = "block";
                }
              }
            }}
          />
          <span className="brand-fallback">FedShield</span>
        </div>

        <div className="nav-section-label">Workspace</div>
        <nav>
          {navItem("dashboard", "Dashboard", LayoutDashboard)}
          {navItem("registry", "Anagrafica Clienti", Users)}
          {navItem("checklist", "Checklist", ClipboardCheck)}
          {navItem("quotes", "Preventivi", FileText)}
        </nav>

        <div className="nav-section-label">Analisi</div>
        <nav>
          {navItem("kpi", "KPI", BarChart3)}
          {navItem("odv", "ODV", ShieldCheck)}
        </nav>

        <div className="nav-section-label">Intelligenza</div>
        <nav>
          {navItem("chatbot", "AuditBot", Bot)}
          {user.role === "admin" && navItem("normsync", "NormSync", ScrollText)}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{userInitials(user.fullName)}</div>
          <div className="sidebar-user-meta">
            <div className="sidebar-user-name">{user.fullName}</div>
            <div className="sidebar-user-role">{roleLabel(user.role)}</div>
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="content-header">
          <div>
            <h1>Benvenuto {user.fullName.split(/\s+/)[0]}</h1>
            <p>Piattaforma antisanzione · {roleLabel(user.role)}</p>
          </div>
          <div className="header-actions">
            {alertCount > 0 && (
              <button
                className="icon-btn"
                aria-label={`${alertCount} notifiche`}
                title={`${alertCount} notifiche`}
              >
                <Bell />
                <span
                  className="notification-badge"
                  style={{ position: "absolute", top: -6, right: -6 }}
                >
                  {alertCount}
                </span>
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="icon-btn"
              aria-label={theme === "dark" ? "Tema chiaro" : "Tema scuro"}
              title={theme === "dark" ? "Tema chiaro" : "Tema scuro"}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
            <button onClick={onSyncNow} className="logout-btn">
              <RefreshCw />
              Sync
            </button>
            <button onClick={onLogout} className="logout-btn">
              <LogOut />
              Esci
            </button>
          </div>
        </header>

        <section className="panel">
          <h2>Stato Sync &amp; Licenza</h2>
          <div className="kpi-grid">
            <article className="kpi-card">
              <h3>Stato device</h3>
              <strong>{syncStatus.deviceStatus ?? "n/d"}</strong>
            </article>
            <article className="kpi-card">
              <h3>Eventi in coda</h3>
              <strong>{syncStatus.queueSize}</strong>
            </article>
            <article className="kpi-card" style={{ gridColumn: "span 2" }}>
              <h3>Ultimo sync</h3>
              <strong style={{ fontSize: 15, fontWeight: 500 }}>
                {syncStatus.message}
              </strong>
            </article>
          </div>
        </section>

        {activeView === "dashboard" ? (
          <>
            <section className="kpi-grid">
              <article className="kpi-card">
                <h3>Aziende gestite</h3>
                <strong>{companies.length}</strong>
              </article>
              <article className="kpi-card">
                <h3>Sopralluoghi</h3>
                <strong>{inspections.length}</strong>
              </article>
              <article className="kpi-card">
                <h3>NC sanzionabili</h3>
                <strong>{sanctionableNc}</strong>
              </article>
              <article className="kpi-card">
                <h3>Stato sistema</h3>
                <strong style={{ fontSize: 22 }}>Online</strong>
              </article>
            </section>

            <section className="panel">
              <h2>Ultimi sopralluoghi</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Titolo</th>
                      <th>Azienda</th>
                      <th>Data</th>
                      <th>Stato</th>
                      <th>NC</th>
                      <th>Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspections.slice(0, 8).map((inspection) => (
                      <tr key={inspection.id}>
                        <td>{inspection.title}</td>
                        <td>{inspection.company.name}</td>
                        <td>
                          {new Date(inspection.happenedAt).toLocaleDateString("it-IT")}
                        </td>
                        <td>
                          <span className="status-pill-info">{inspection.status}</span>
                        </td>
                        <td>{inspection.nonConformities.length}</td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="ghost-btn"
                              onClick={() => handleGenerateReportPdf(inspection.id)}
                            >
                              Verbale PDF
                            </button>
                            <button
                              className="ghost-btn"
                              onClick={() => handleGenerateAttestato(inspection.id)}
                            >
                              Attestato
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {inspections.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--color-text-muted)" }}>
                          Nessun sopralluogo presente.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {statusMessage ? <p className="status-message">{statusMessage}</p> : null}
            </section>
          </>
        ) : activeView === "checklist" ? (
          <ChecklistPage
            token={token}
            user={user}
            companies={companies}
            inspections={inspections}
            initialCompanyId={checklistSelection.companyId}
            initialInspectionId={checklistSelection.inspectionId}
            selectionToken={checklistSelection.token}
            onReload={onReload}
            onOpenQr={(id, kind) => {
              setQrAssetId(id);
              setQrAssetKind(kind);
              setActiveView("assetQr");
            }}
          />
        ) : activeView === "registry" ? (
          <CustomerRegistryPage
            token={token}
            companies={companies}
            inspections={inspections}
            onUseForInspection={handleUseForInspection}
          />
        ) : activeView === "quotes" ? (
          <QuotesPage token={token} companies={companies} />
        ) : activeView === "kpi" ? (
          <KpiPage token={token} companies={companies} />
        ) : activeView === "chatbot" ? (
          <ChatbotPage token={token} />
        ) : activeView === "normsync" ? (
          <NormSyncAdminPage token={token} />
        ) : activeView === "assetQr" ? (
          <AssetQrPage
            token={token}
            companies={companies}
            assetId={qrAssetId}
            assetKind={qrAssetKind}
            onBack={() => {
              setActiveView("checklist");
              setQrAssetId(null);
              setQrAssetKind(null);
            }}
          />
        ) : (
          <OdvPage token={token} companies={companies} />
        )}
      </main>
    </div>
  );
}
