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
  CloudUpload,
  TriangleAlert,
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
import { formattaData } from "../lib/oraItalia";
import {
  etichettaRuolo,
  etichettaStatoLicenza,
  etichettaStatoSopralluogo,
  pastigliaStatoSopralluogo,
} from "../lib/etichette";
import OrologioTestata from "../components/OrologioTestata";
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

const LOGHI_BARRA_LATERALE = [
  "/fedshield-logo-clean.png",
  "/fedshield-logo.png",
  "/fedshield-logo.jpg",
  "/fedshield-logo.jpeg",
  "/fedshield-logo.webp",
  "/fedshield-logo.svg",
  "/logo.png",
  "/logo.jpg",
];

function inizialiUtente(nomeCompleto: string): string {
  const parti = nomeCompleto.trim().split(/\s+/);
  if (parti.length === 0) return "?";
  if (parti.length === 1) return parti[0].slice(0, 2).toUpperCase();
  return (parti[0][0] + parti[parti.length - 1][0]).toUpperCase();
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

  const ncSanzionabili = useMemo(
    () =>
      inspections
        .flatMap((item) => item.nonConformities)
        .filter((nc) => nc.isSanctionable).length,
    [inspections],
  );

  const daValidare = useMemo(
    () => inspections.filter((item) => item.status === "pending_validation").length,
    [inspections],
  );

  // La sincronizzazione si mostra solo quando c'è davvero qualcosa da sapere.
  const licenzaDaControllare = Boolean(
    syncStatus.deviceStatus && syncStatus.deviceStatus !== "active",
  );
  const modificheInAttesa = syncStatus.queueSize > 0;

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

  function handleUseForInspection(companyId: string, inspectionId?: string) {
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
        aria-current={active ? "page" : undefined}
      >
        <Icon aria-hidden="true" />
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
            src={LOGHI_BARRA_LATERALE[logoIndex]}
            alt="FedShield"
            onError={(event) => {
              if (logoIndex < LOGHI_BARRA_LATERALE.length - 1) {
                setLogoIndex((current) => current + 1);
              } else {
                event.currentTarget.style.display = "none";
                const ripiego = event.currentTarget.nextElementSibling as HTMLElement | null;
                if (ripiego) {
                  ripiego.style.display = "block";
                }
              }
            }}
          />
          <span className="brand-fallback">FedShield</span>
        </div>

        <div className="nav-section-label">Area di lavoro</div>
        <nav>
          {navItem("dashboard", "Riepilogo", LayoutDashboard)}
          {navItem("registry", "Anagrafica Clienti", Users)}
          {navItem("checklist", "Sopralluoghi", ClipboardCheck)}
          {navItem("quotes", "Preventivi", FileText)}
        </nav>

        <div className="nav-section-label">Analisi</div>
        <nav>
          {navItem("kpi", "Indicatori", BarChart3)}
          {navItem("odv", "Organo di Vigilanza", ShieldCheck)}
        </nav>

        <div className="nav-section-label">Assistenza</div>
        <nav>
          {navItem("chatbot", "Assistente Normativo", Bot)}
          {user.role === "admin" && navItem("normsync", "Aggiornamenti Normativi", ScrollText)}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{inizialiUtente(user.fullName)}</div>
          <div className="sidebar-user-meta">
            <div className="sidebar-user-name">{user.fullName}</div>
            <div className="sidebar-user-role">{etichettaRuolo(user.role)}</div>
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="content-header">
          <div>
            <h1>Benvenuto {user.fullName.split(/\s+/)[0]}</h1>
            <p>Piattaforma antisanzione · {etichettaRuolo(user.role)}</p>
          </div>
          <div className="header-actions">
            {/* Data e ora italiane, rilevate da sole e sempre allineate
                all'ora legale o solare in vigore. */}
            <OrologioTestata />

            <button
              className="icon-btn"
              aria-label={alertCount > 0 ? `${alertCount} notifiche` : "Nessuna notifica"}
              title={alertCount > 0 ? `${alertCount} notifiche` : "Nessuna notifica"}
            >
              <Bell aria-hidden="true" />
              {alertCount > 0 ? (
                <span
                  className="notification-badge"
                  style={{ position: "absolute", top: -7, right: -7 }}
                >
                  {alertCount}
                </span>
              ) : null}
            </button>
            <button
              onClick={toggleTheme}
              className="icon-btn"
              aria-label={theme === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro"}
              title={theme === "dark" ? "Tema chiaro" : "Tema scuro"}
            >
              {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>
            <button
              onClick={onSyncNow}
              className="logout-btn"
              title={syncStatus.message}
            >
              <RefreshCw aria-hidden="true" />
              Sincronizza
            </button>
            <button onClick={onLogout} className="logout-btn">
              <LogOut aria-hidden="true" />
              Esci
            </button>
          </div>
        </header>

        {/* Avvisi tecnici: compaiono solo quando richiedono un intervento,
            così la schermata resta occupata dal lavoro vero. */}
        {licenzaDaControllare ? (
          <div className="status-banner status-banner-error">
            <TriangleAlert
              aria-hidden="true"
              size={15}
              style={{ verticalAlign: "-2px", marginRight: 6 }}
            />
            Licenza del dispositivo: {etichettaStatoLicenza(syncStatus.deviceStatus)}. Contatta
            l&apos;amministratore per ripristinare la sincronizzazione.
          </div>
        ) : null}

        {modificheInAttesa ? (
          <div className="status-banner status-banner-warning">
            <CloudUpload
              aria-hidden="true"
              size={15}
              style={{ verticalAlign: "-2px", marginRight: 6 }}
            />
            {syncStatus.queueSize}{" "}
            {syncStatus.queueSize === 1 ? "modifica ancora da inviare" : "modifiche ancora da inviare"}.
            Premi Sincronizza quando torni in linea.
          </div>
        ) : null}

        {activeView === "dashboard" ? (
          <>
            <section className="kpi-grid">
              <article className="kpi-card">
                <h3>Aziende seguite</h3>
                <strong>{companies.length}</strong>
              </article>
              <article className="kpi-card">
                <h3>Sopralluoghi svolti</h3>
                <strong>{inspections.length}</strong>
              </article>
              <article className="kpi-card">
                <h3>Da validare</h3>
                <strong>{daValidare}</strong>
                <span className="kpi-card-nota">
                  {daValidare === 0 ? "Nessuno in attesa" : "In attesa di controllo"}
                </span>
              </article>
              <article className={`kpi-card ${ncSanzionabili > 0 ? "kpi-card-critico" : ""}`}>
                <h3>Non conformità sanzionabili</h3>
                <strong>{ncSanzionabili}</strong>
                <span className="kpi-card-nota">
                  {ncSanzionabili === 0 ? "Nessun rischio aperto" : "Da risolvere con il cliente"}
                </span>
              </article>
            </section>

            <section className="panel">
              <h2>Ultimi sopralluoghi</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Azienda</th>
                      <th>Sopralluogo</th>
                      <th>Data</th>
                      <th>Stato</th>
                      <th>NC</th>
                      <th>Documenti</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspections.slice(0, 8).map((inspection) => (
                      <tr key={inspection.id}>
                        <td>{inspection.company.name}</td>
                        <td>{inspection.title}</td>
                        <td>{formattaData(inspection.happenedAt)}</td>
                        <td>
                          <span className={pastigliaStatoSopralluogo(inspection.status)}>
                            {etichettaStatoSopralluogo(inspection.status)}
                          </span>
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
                        <td colSpan={6} className="tabella-vuota">
                          Nessun sopralluogo registrato. Apri Sopralluoghi per avviarne uno.
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
            onReload={onReload}
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
