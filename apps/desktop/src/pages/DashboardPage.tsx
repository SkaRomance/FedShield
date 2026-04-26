import { useMemo, useState } from "react";
import {
  Company,
  downloadGeneratedDocument,
  generateAttestatoPdf,
  generateInspectionReportPdf,
  Inspection,
} from "../api";
import { queueSyncEvent } from "../services/syncManager";
import { useNotificationBadge } from "../hooks/useNotificationBadge";
import ChecklistPage from "./ChecklistPage";
import CustomerRegistryPage from "./CustomerRegistryPage";
import KpiPage from "./KpiPage";
import OdvPage from "./OdvPage";
import QuotesPage from "./QuotesPage";
import TrainingPage from "./TrainingPage";
import ChatbotPage from "./ChatbotPage";
import NormSyncAdminPage from "./NormSyncAdminPage";
import AssetsPage from "./AssetsPage";
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
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "registry"
    | "checklist"
    | "quotes"
    | "kpi"
    | "odv"
    | "training"
    | "chatbot"
    | "normsync"
    | "assets"
    | "assetQr"
  >("dashboard");
  const [qrAssetId, setQrAssetId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [logoIndex, setLogoIndex] = useState(0);
  const [checklistSelection, setChecklistSelection] = useState<{
    companyId?: string;
    inspectionId?: string;
    token: number;
  }>({ token: 0 });

  const { count: alertCount } = useNotificationBadge(token);

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
        <nav>
          <button
            className={`nav-item ${activeView === "dashboard" ? "nav-item-active" : ""}`}
            onClick={() => setActiveView("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`nav-item ${activeView === "registry" ? "nav-item-active" : ""}`}
            onClick={() => setActiveView("registry")}
          >
            Anagrafica Clienti
          </button>
          <button
            className={`nav-item ${activeView === "checklist" ? "nav-item-active" : ""}`}
            onClick={() => setActiveView("checklist")}
          >
            Checklist
          </button>
          <button
            className={`nav-item ${activeView === "quotes" ? "nav-item-active" : ""}`}
            onClick={() => setActiveView("quotes")}
          >
            Preventivi
          </button>
          <button
            className={`nav-item ${activeView === "kpi" ? "nav-item-active" : ""}`}
            onClick={() => setActiveView("kpi")}
          >
            KPI
          </button>
          <button
            className={`nav-item ${activeView === "odv" ? "nav-item-active" : ""}`}
            onClick={() => setActiveView("odv")}
          >
            ODV
          </button>
          <button
            className={`nav-item ${activeView === "training" ? "nav-item-active" : ""}`}
            onClick={() => setActiveView("training")}
          >
            Formazione
          </button>
          <button
            className={`nav-item ${activeView === "assets" || activeView === "assetQr" ? "nav-item-active" : ""}`}
            onClick={() => {
              setActiveView("assets");
              setQrAssetId(null);
            }}
          >
            Asset & Attrezzature
          </button>
          <button
            className={`nav-item ${activeView === "chatbot" ? "nav-item-active" : ""}`}
            onClick={() => setActiveView("chatbot")}
          >
            🤖 AuditBot
          </button>
          {user.role === "admin" && (
            <>
              <button
                className={`nav-item ${activeView === "normsync" ? "nav-item-active" : ""}`}
                onClick={() => setActiveView("normsync")}
              >
                📜 NormSync
              </button>
              <button className="nav-item" disabled>
                Admin KPI
              </button>
            </>
          )}
        </nav>
      </aside>

      <main className="content">
        <header className="content-header">
          <div>
            <h1>Benvenuto {user.fullName}</h1>
            <p>{roleLabel(user.role)} • Piattaforma Antisanzione</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {alertCount > 0 && (
              <span
                style={{
                  background: "crimson",
                  color: "white",
                  borderRadius: "50%",
                  padding: "4px 10px",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {alertCount}
              </span>
            )}
            <button onClick={onSyncNow} className="logout-btn">
              Sync ora
            </button>
            <button onClick={onLogout} className="logout-btn">
              Esci
            </button>
          </div>
        </header>

        <section className="panel" style={{ marginTop: 12 }}>
          <h2>Stato Sync & Licenza</h2>
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
              <strong style={{ fontSize: 16 }}>{syncStatus.message}</strong>
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
                <strong>Online</strong>
              </article>
            </section>

            <section className="panel">
              <h2>Ultimi sopralluoghi</h2>
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
                      <td>{inspection.status}</td>
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
                      <td colSpan={6}>Nessun sopralluogo presente.</td>
                    </tr>
                  )}
                </tbody>
              </table>
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
        )         : activeView === "training" ? (
          <TrainingPage token={token} companies={companies} />
        ) : activeView === "chatbot" ? (
          <ChatbotPage token={token} />
        ) : activeView === "normsync" ? (
          <NormSyncAdminPage token={token} />
        ) : activeView === "assets" ? (
          <AssetsPage
            token={token}
            companies={companies}
            onOpenQr={(id) => {
              setQrAssetId(id);
              setActiveView("assetQr");
            }}
          />
        ) : activeView === "assetQr" ? (
          <AssetQrPage
            token={token}
            companies={companies}
            assetId={qrAssetId}
            onBack={() => {
              setActiveView("assets");
              setQrAssetId(null);
            }}
          />
        ) : (
          <OdvPage token={token} companies={companies} />
        )}
      </main>
    </div>
  );
}
