// Step 4 "Attrezzature e Macchinari" — Redesign Avanzato con Catalogo ATECO,
// Dati minimi obbligatori di legge (Costruttore, Modello, Matricola, Marcatura CE, Verifiche INAIL art. 71 c. 11),
// Libreria requisiti di sicurezza per ciascuna macchina e collegamento con la Formazione Operatori (Accordo Stato-Regioni).

import { useEffect, useState, useMemo } from "react";
import {
  ChecklistItem,
  Equipment,
  fetchEquipmentPaged,
  fetchFireExtinguishersPaged,
  fetchFirstAidKitsPaged,
  fetchMachinesPaged,
  createMachine,
  updateMachine,
  deleteMachine,
  FireExtinguisher,
  FirstAidKit,
  Machine,
} from "../../api";
import EquipmentTab from "../assets/EquipmentTab";
import ExtinguishersTab from "../assets/ExtinguishersTab";
import FirstAidTab from "../assets/FirstAidTab";
import {
  getSectorMachineCatalogForAteco,
  parseMachineMetadata,
  serializeMachineMetadata,
  SectorMachineTemplate,
  MachineSafetyCheckDef,
  TRAINING_REQUIREMENTS_LIBRARY,
  MachineFullDetailsMetadata,
} from "./normativeMachineCatalog";

export type AssetSubTab = "machines" | "equipment" | "extinguishers" | "firstAid";

interface Step4AssetAttrezzatureProps {
  token: string;
  companyId: string;
  onOpenQr: (assetId: string, kind: "equipment" | "machine" | "extinguisher" | "firstAid") => void;
  onAddCustomItems?: (
    items: Array<{
      section?: string;
      area: string;
      question: string;
      normReference?: string;
      defaultSeverity?: number;
      defaultSanctionable?: boolean;
      domain?: "safety" | "haccp" | "both";
    }>,
  ) => Promise<unknown>;
  existingChecklistItems?: ChecklistItem[];
  atecoCode?: string;
  isInspectionValidated?: boolean;
}

export default function Step4AssetAttrezzature({
  token,
  companyId,
  onOpenQr,
  onAddCustomItems,
  existingChecklistItems = [],
  atecoCode,
  isInspectionValidated = false,
}: Step4AssetAttrezzatureProps) {
  const [tab, setTab] = useState<AssetSubTab>("machines");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [extinguishers, setExtinguishers] = useState<FireExtinguisher[]>([]);
  const [firstAidKits, setFirstAidKits] = useState<FirstAidKit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [integratingMachineId, setIntegratingMachineId] = useState<string | null>(null);

  // Modale inserimento/modifica macchina con tutti i dati minimi
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  // Form state per macchina
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("");
  const [formManufacturer, setFormManufacturer] = useState("");
  const [formModel, setFormModel] = useState("");
  const [formSerialNumber, setFormSerialNumber] = useState("");
  const [formBuildYear, setFormBuildYear] = useState<number | undefined>(new Date().getFullYear() - 2);
  const [formCeStatus, setFormCeStatus] = useState<"ce_compliant" | "ante_ce_annex_v" | "non_compliant">("ce_compliant");
  const [formManualPresent, setFormManualPresent] = useState<"yes" | "no">("yes");
  const [formMaintenanceLogPresent, setFormMaintenanceLogPresent] = useState<"yes" | "no" | "expired">("yes");
  const [formInailCheckRequired, setFormInailCheckRequired] = useState(false);
  const [formInailSerial, setFormInailSerial] = useState("");
  const [formInailLastCheckDate, setFormInailLastCheckDate] = useState("");
  const [formInailNextCheckDate, setFormInailNextCheckDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Modale per aggiungere requisito personalizzato su una specifica macchina
  const [customReqModalMachine, setCustomReqModalMachine] = useState<Machine | null>(null);
  const [customReqQuestion, setCustomReqQuestion] = useState("");
  const [customReqNorm, setCustomReqNorm] = useState("");
  const [customReqSeverity, setCustomReqSeverity] = useState(3);
  const [customReqSanctionable, setCustomReqSanctionable] = useState(true);

  // Catalogo macchine suggerite per l'ATECO aziendale
  const sectorCatalog = useMemo(() => getSectorMachineCatalogForAteco(atecoCode), [atecoCode]);

  useEffect(() => {
    if (companyId) void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, token]);

  async function reload() {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const [eq, ma, ex, kits] = await Promise.all([
        fetchEquipmentPaged(token, { companyId }),
        fetchMachinesPaged(token, { companyId }),
        fetchFireExtinguishersPaged(token, { companyId }),
        fetchFirstAidKitsPaged(token, { companyId }),
      ]);
      setEquipment(eq.items);
      setMachines(ma.items);
      setExtinguishers(ex.items);
      setFirstAidKits(kits.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nel caricamento dei beni e attrezzature");
    } finally {
      setLoading(false);
    }
  }

  // Apertura form creazione macchina
  function handleOpenCreate(template?: SectorMachineTemplate) {
    setEditingMachine(null);
    if (template) {
      setFormName(template.name);
      setFormType(template.type);
      setFormManufacturer(template.suggestedManufacturer);
      setFormModel(template.suggestedModel);
      setFormSerialNumber(`SN-${Math.floor(100000 + Math.random() * 900000)}`);
      setFormBuildYear(new Date().getFullYear() - 3);
      setFormCeStatus("ce_compliant");
      setFormManualPresent("yes");
      setFormMaintenanceLogPresent("yes");
      setFormInailCheckRequired(template.isSubjectToInailCheck);
      setFormInailSerial(template.isSubjectToInailCheck ? `INAIL-${Math.floor(10000 + Math.random() * 90000)}` : "");
      setFormInailLastCheckDate(template.isSubjectToInailCheck ? new Date(Date.now() - 180 * 86400000).toISOString().split("T")[0] : "");
      setFormInailNextCheckDate(template.isSubjectToInailCheck ? new Date(Date.now() + 185 * 86400000).toISOString().split("T")[0] : "");
      setFormLocation("");
    } else {
      setFormName("");
      setFormType("Macchina / Impianto");
      setFormManufacturer("");
      setFormModel("");
      setFormSerialNumber("");
      setFormBuildYear(new Date().getFullYear() - 1);
      setFormCeStatus("ce_compliant");
      setFormManualPresent("yes");
      setFormMaintenanceLogPresent("yes");
      setFormInailCheckRequired(false);
      setFormInailSerial("");
      setFormInailLastCheckDate("");
      setFormInailNextCheckDate("");
      setFormLocation("");
    }
    setShowMachineModal(true);
  }

  // Apertura form modifica macchina
  function handleOpenEdit(m: Machine) {
    setEditingMachine(m);
    const meta = parseMachineMetadata(m.note);
    setFormName(m.name);
    setFormType(m.type);
    setFormManufacturer(m.manufacturer || "");
    setFormModel(m.model || "");
    setFormSerialNumber(m.serialNumber || "");
    setFormLocation(m.location || "");
    setFormBuildYear(meta.buildYear ?? new Date().getFullYear() - 2);
    setFormCeStatus(meta.ceStatus ?? "ce_compliant");
    setFormManualPresent(meta.manualPresent ?? "yes");
    setFormMaintenanceLogPresent(meta.maintenanceLogPresent ?? "yes");
    setFormInailCheckRequired(meta.inailCheckRequired ?? false);
    setFormInailSerial(meta.inailSerial || "");
    setFormInailLastCheckDate(meta.inailLastCheckDate || "");
    setFormInailNextCheckDate(meta.inailNextCheckDate || "");
    setShowMachineModal(true);
  }

  // Eliminazione macchina
  async function handleDeleteMachine(m: Machine) {
    if (!window.confirm(`Sei sicuro di voler eliminare la macchina "${m.name}" dal sopralluogo?`)) return;
    setError(null);
    try {
      await deleteMachine(token, m.id);
      setActionMessage(`Macchina "${m.name}" eliminata dal censimento.`);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante l'eliminazione della macchina.");
    }
  }

  // Salvataggio macchina (nuova o modifica)
  async function handleSaveMachine(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      setError("Il nome della macchina è obbligatorio.");
      return;
    }

    setFormSubmitting(true);
    setError(null);
    try {
      // Identifica il template corrispondente per agganciare il corso di formazione
      const matchingTemplate = sectorCatalog.machines.find((t) => t.name.toLowerCase() === formName.toLowerCase())
        || sectorCatalog.machines[0];
      const training = matchingTemplate ? matchingTemplate.training : TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche;

      // Preserva eventuali requisiti personalizzati già presenti
      const existingMeta = editingMachine ? parseMachineMetadata(editingMachine.note) : {};

      const metadata: MachineFullDetailsMetadata = {
        buildYear: formBuildYear,
        ceStatus: formCeStatus,
        manualPresent: formManualPresent,
        maintenanceLogPresent: formMaintenanceLogPresent,
        inailCheckRequired: formInailCheckRequired,
        inailSerial: formInailSerial.trim() || undefined,
        inailLastCheckDate: formInailLastCheckDate || undefined,
        inailNextCheckDate: formInailNextCheckDate || undefined,
        requiredCourseCode: training.courseCode,
        requiredCourseTitle: training.courseTitle,
        customRequirements: existingMeta.customRequirements,
      };

      const serializedNote = serializeMachineMetadata(metadata);

      const payload = {
        name: formName.trim(),
        type: formType.trim() || "Macchina",
        manufacturer: formManufacturer.trim() || undefined,
        model: formModel.trim() || undefined,
        serialNumber: formSerialNumber.trim() || undefined,
        location: formLocation.trim() || undefined,
        note: serializedNote,
        nextSafetyCheckAt: formInailNextCheckDate ? new Date(formInailNextCheckDate).toISOString() : undefined,
      };

      if (editingMachine) {
        await updateMachine(token, editingMachine.id, payload);
        setActionMessage(`Macchina "${payload.name}" aggiornata con successo.`);
      } else {
        await createMachine(token, { companyId, ...payload });
        setActionMessage(`Macchina "${payload.name}" censita nel sopralluogo.`);
      }

      setShowMachineModal(false);
      setEditingMachine(null);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel salvataggio della macchina.");
    } finally {
      setFormSubmitting(false);
    }
  }

  // Precarica in blocco le macchine tipiche del settore ATECO
  async function handlePreloadSectorMachines() {
    if (!window.confirm(`Vuoi precaricare le ${sectorCatalog.machines.length} macchine tipiche del settore "${sectorCatalog.sectorLabel}"?`)) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      for (const t of sectorCatalog.machines) {
        // Verifica se esiste già per nome
        const already = machines.some((m) => m.name.toLowerCase() === t.name.toLowerCase());
        if (already) continue;

        const meta: MachineFullDetailsMetadata = {
          buildYear: new Date().getFullYear() - 2,
          ceStatus: "ce_compliant",
          manualPresent: "yes",
          maintenanceLogPresent: "yes",
          inailCheckRequired: t.isSubjectToInailCheck,
          inailSerial: t.isSubjectToInailCheck ? `INAIL-${Math.floor(10000 + Math.random() * 90000)}` : undefined,
          inailLastCheckDate: t.isSubjectToInailCheck ? new Date(Date.now() - 120 * 86400000).toISOString().split("T")[0] : undefined,
          inailNextCheckDate: t.isSubjectToInailCheck ? new Date(Date.now() + 245 * 86400000).toISOString().split("T")[0] : undefined,
          requiredCourseCode: t.training.courseCode,
          requiredCourseTitle: t.training.courseTitle,
        };

        await createMachine(token, {
          companyId,
          name: t.name,
          type: t.type,
          manufacturer: t.suggestedManufacturer,
          model: t.suggestedModel,
          serialNumber: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
          note: serializeMachineMetadata(meta),
          nextSafetyCheckAt: meta.inailNextCheckDate ? new Date(meta.inailNextCheckDate).toISOString() : undefined,
        });
      }

      setActionMessage(`✓ Macchine tipiche del settore ${sectorCatalog.sectorLabel} precaricate con successo!`);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il precaricamento.");
    } finally {
      setLoading(false);
    }
  }

  // Aggiunge un requisito personalizzato alla singola macchina
  async function handleAddCustomRequirementToMachine(e: React.FormEvent) {
    e.preventDefault();
    if (!customReqModalMachine || !customReqQuestion.trim()) return;

    try {
      const meta = parseMachineMetadata(customReqModalMachine.note);
      const newReq: MachineSafetyCheckDef = {
        code: `CUSTOM_${Date.now()}`,
        title: customReqQuestion.trim().substring(0, 40),
        question: customReqQuestion.trim(),
        normReference: customReqNorm.trim() || "D.Lgs. 81/2008 Titolo III",
        defaultSeverity: customReqSeverity,
        defaultSanctionable: customReqSanctionable,
      };

      const customList = meta.customRequirements || [];
      customList.push(newReq);
      meta.customRequirements = customList;

      await updateMachine(token, customReqModalMachine.id, {
        note: serializeMachineMetadata(meta),
      });

      // Se disponibile, aggiunge anche alla checklist globale
      if (onAddCustomItems) {
        await onAddCustomItems([
          {
            section: "premises_equipment",
            domain: "safety",
            area: `Sicurezza Macchine - ${customReqModalMachine.name}`,
            question: newReq.question,
            normReference: newReq.normReference,
            defaultSeverity: newReq.defaultSeverity,
            defaultSanctionable: newReq.defaultSanctionable,
          },
        ]);
      }

      setActionMessage(`✓ Requisito personalizzato aggiunto a "${customReqModalMachine.name}" e incluso nella checklist!`);
      setCustomReqModalMachine(null);
      setCustomReqQuestion("");
      setCustomReqNorm("");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore aggiunta requisito personalizzato.");
    }
  }

  // Trova i controlli di sicurezza definiti nel catalogo per una macchina
  function getChecksForMachine(m: Machine): MachineSafetyCheckDef[] {
    const meta = parseMachineMetadata(m.note);
    const custom = meta.customRequirements || [];

    const matchedTemplate = sectorCatalog.machines.find(
      (t) => t.name.toLowerCase() === m.name.toLowerCase() || m.name.toLowerCase().includes(t.machineKey),
    );

    const standard = matchedTemplate ? matchedTemplate.safetyChecks : [
      {
        code: "CE_CONFORMITY",
        title: "Marcatura CE e Dichiarazione di Conformità",
        question: `La macchina ${m.name} presenta marcatura CE visibile e leggibile, con targhetta identificativa del costruttore e dichiarazione di conformità CE/UE disponibile in azienda?`,
        normReference: "D.Lgs. 81/2008, art. 70 c. 1; D.Lgs. 17/2010",
        defaultSeverity: 3,
        defaultSanctionable: true,
      },
      {
        code: "USER_MANUAL",
        title: "Libretto d'Uso e Manutenzione in Lingua Italiana",
        question: `È presente in azienda e prontamente consultabile dagli operatori il manuale d'uso e manutenzione di ${m.name} redatto in lingua italiana?`,
        normReference: "D.Lgs. 81/2008, art. 70 c. 2 e art. 73 c. 1",
        defaultSeverity: 2,
        defaultSanctionable: true,
      },
      {
        code: "GUARDS_AND_INTERLOCKS",
        title: "Ripari e Dispositivi di Sicurezza Organi in Movimento",
        question: `Tutti gli organi mobili e le zone di pericolo di ${m.name} sono dotati di ripari fissi o mobili, carter e microinterruttori di sicurezza efficienti contro il rischio di contatto o trascinamento?`,
        normReference: "D.Lgs. 81/2008, All. V, parte I, p. 6 e All. VI",
        defaultSeverity: 4,
        defaultSanctionable: true,
      },
      {
        code: "EMERGENCY_STOP",
        title: "Dispositivo di Arresto di Emergenza",
        question: `La macchina ${m.name} è provvista di dispositivo di arresto di emergenza ad azione rapida (fungo d'emergenza), chiaramente individuabile, accessibile e funzionante?`,
        normReference: "D.Lgs. 81/2008, All. V, parte I, p. 2",
        defaultSeverity: 3,
        defaultSanctionable: true,
      },
      {
        code: "MAINTENANCE_LOG",
        title: "Registro Manutenzioni e Controlli Periodici",
        question: `Gli interventi di manutenzione programmata, la pulizia e le verifiche periodiche di sicurezza su ${m.name} sono puntualmente eseguiti e registrati sull'apposito registro?`,
        normReference: "D.Lgs. 81/2008, art. 71 c. 4 e c. 8",
        defaultSeverity: 2,
        defaultSanctionable: true,
      },
    ];

    return [...standard, ...custom];
  }

  // Trova il requisito formativo obbligatorio collegato alla macchina
  function getTrainingForMachine(m: Machine) {
    const meta = parseMachineMetadata(m.note);
    if (meta.requiredCourseTitle) {
      return {
        courseCode: meta.requiredCourseCode || "FORMAZ_ATTREZZATURE",
        courseTitle: meta.requiredCourseTitle,
        normReference: "D.Lgs. 81/2008 art. 73",
        minHours: 4,
        frequencyYears: 5,
        requiresPatentinoAccordoSR: false,
      };
    }

    const matchedTemplate = sectorCatalog.machines.find(
      (t) => t.name.toLowerCase() === m.name.toLowerCase() || m.name.toLowerCase().includes(t.machineKey),
    );

    return matchedTemplate ? matchedTemplate.training : TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche;
  }

  if (!companyId) {
    return (
      <div className="panel section-panel">
        <h3>Attrezzature e Macchinari</h3>
        <p>Seleziona o crea prima un'azienda al passo &quot;Dati Azienda&quot; per procedere con il censimento.</p>
      </div>
    );
  }

  return (
    <div className="panel section-panel" style={{ padding: "20px" }}>
      {/* Header principale */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "22px", color: "var(--color-primary, #0f172a)" }}>
            Attrezzature, Macchinari e Impianti Aziendali
          </h3>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Censimento macchinari con dati minimi di legge, marcatura CE, verifiche INAIL art. 71 c. 11, controlli di sicurezza specifici e formazione operatori (Accordo Stato-Regioni).
          </p>
        </div>

        {/* Pulsanti Azione Rapida */}
        {!isInspectionValidated && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {machines.length === 0 && (
              <button
                type="button"
                className="button"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={handlePreloadSectorMachines}
              >
                ⚡ Precarica Attrezzature del Settore ({sectorCatalog.machines.length})
              </button>
            )}

            <button
              type="button"
              className="button"
              style={{
                backgroundColor: "var(--color-primary, #0f172a)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => handleOpenCreate()}
            >
              ➕ Aggiungi Macchinario
            </button>
          </div>
        )}
      </div>

      {/* Barra Sottoschede */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "2px solid #e2e8f0" }}>
        <button
          type="button"
          onClick={() => setTab("machines")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderBottom: tab === "machines" ? "3px solid var(--color-primary, #0f172a)" : "3px solid transparent",
            backgroundColor: "transparent",
            color: tab === "machines" ? "var(--color-primary, #0f172a)" : "#64748b",
            fontWeight: tab === "machines" ? 700 : 500,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>🚜 Macchine & Impianti ({machines.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("equipment")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderBottom: tab === "equipment" ? "3px solid var(--color-primary, #0f172a)" : "3px solid transparent",
            backgroundColor: "transparent",
            color: tab === "equipment" ? "var(--color-primary, #0f172a)" : "#64748b",
            fontWeight: tab === "equipment" ? 700 : 500,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>🔧 Attrezzature Minori ({equipment.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("extinguishers")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderBottom: tab === "extinguishers" ? "3px solid var(--color-primary, #0f172a)" : "3px solid transparent",
            backgroundColor: "transparent",
            color: tab === "extinguishers" ? "var(--color-primary, #0f172a)" : "#64748b",
            fontWeight: tab === "extinguishers" ? 700 : 500,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>🧯 Estintori ({extinguishers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("firstAid")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderBottom: tab === "firstAid" ? "3px solid var(--color-primary, #0f172a)" : "3px solid transparent",
            backgroundColor: "transparent",
            color: tab === "firstAid" ? "var(--color-primary, #0f172a)" : "#64748b",
            fontWeight: tab === "firstAid" ? 700 : 500,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>🩹 Cassette PS ({firstAidKits.length})</span>
        </button>
      </div>

      {actionMessage && (
        <div style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: "14px", fontWeight: 600 }}>
          {actionMessage}
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: "14px" }}>
          {error}
        </div>
      )}

      {loading && <p style={{ color: "#64748b" }}>Caricamento dati attrezzature in corso...</p>}

      {/* ============================================================== */}
      {/* SCHEDA 1: MACCHINE & IMPIANTI CON DATI MINIMI E REQUISITI      */}
      {/* ============================================================== */}
      {tab === "machines" && (
        <div>
          {/* Banner Settore ATECO Rilevato */}
          <div
            style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: "12px", color: "#166534", fontWeight: 700, textTransform: "uppercase" }}>
                SETTORE ATTIVITÀ ATECO RILEVATO
              </div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#14532d" }}>
                {sectorCatalog.sectorLabel} {atecoCode ? `(Codice ATECO ${atecoCode})` : ""}
              </div>
            </div>

            {/* Menu Rapido: Scegli dalla libreria macchine tipiche */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "#15803d", fontWeight: 600 }}>
                Aggiungi tipica dal catalogo:
              </span>
              <select
                disabled={isInspectionValidated}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  const tmpl = sectorCatalog.machines.find((m) => m.machineKey === val);
                  if (tmpl) handleOpenCreate(tmpl);
                  e.target.value = "";
                }}
                style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #86efac", fontSize: "13px" }}
              >
                <option value="">— Seleziona macchina tipica —</option>
                {sectorCatalog.machines.map((tm) => (
                  <option key={tm.machineKey} value={tm.machineKey}>
                    {tm.name} ({tm.suggestedManufacturer})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Elenco Macchine Censite */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {machines.map((m) => {
              const meta = parseMachineMetadata(m.note);
              const checks = getChecksForMachine(m);
              const training = getTrainingForMachine(m);

              const isIncludedInChecklist = existingChecklistItems.some(
                (it) => it.area.toLowerCase() === `Sicurezza Macchine - ${m.name}`.toLowerCase(),
              );

              return (
                <div
                  key={m.id}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "18px 20px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Riga Superiore: Dati Anagrafici Principali e Azioni */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <h4 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>{m.name}</h4>
                        <span
                          style={{
                            backgroundColor: "#f1f5f9",
                            color: "#475569",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {m.type}
                        </span>
                        {m.location && (
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            📍 {m.location}
                          </span>
                        )}
                      </div>

                      {/* Riga Dati Minimi: Costruttore, Modello, Matricola, Anno */}
                      <div
                        style={{
                          display: "flex",
                          gap: 14,
                          alignItems: "center",
                          flexWrap: "wrap",
                          marginTop: 6,
                          fontSize: "13px",
                          color: "#334155",
                        }}
                      >
                        <div>
                          <strong>Costruttore:</strong> {m.manufacturer || "Non indicato"}
                        </div>
                        <div>
                          <strong>Modello:</strong> {m.model || "Standard"}
                        </div>
                        <div>
                          <strong>Matricola:</strong>{" "}
                          <span style={{ fontFamily: "monospace", backgroundColor: "#f8fafc", padding: "1px 6px", borderRadius: 4, border: "1px solid #cbd5e1" }}>
                            {m.serialNumber || "N/D"}
                          </span>
                        </div>
                        <div>
                          <strong>Anno:</strong> {meta.buildYear || "—"}
                        </div>
                      </div>
                    </div>

                    {/* Azioni Modifica / Elimina / QR */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => onOpenQr(m.id, "machine")}
                        style={{
                          backgroundColor: "#f1f5f9",
                          border: "1px solid #cbd5e1",
                          color: "#334155",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                        title="Genera QR Code"
                      >
                        📱 QR
                      </button>
                      {!isInspectionValidated && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(m)}
                            style={{
                              backgroundColor: "#f1f5f9",
                              border: "1px solid #cbd5e1",
                              color: "#334155",
                              padding: "6px 12px",
                              borderRadius: 6,
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            ✏️ Modifica
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMachine(m)}
                            style={{
                              backgroundColor: "#fee2e2",
                              border: "1px solid #fca5a5",
                              color: "#b91c1c",
                              padding: "6px 10px",
                              borderRadius: 6,
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                            title="Elimina macchina dal sopralluogo"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Badge di Stato di Conformità (CE, Manuale, Registro, INAIL) */}
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      flexWrap: "wrap",
                      padding: "10px 14px",
                      backgroundColor: "#f8fafc",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      marginBottom: 14,
                    }}
                  >
                    {/* Marcatura CE */}
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: "12px",
                        fontWeight: 700,
                        backgroundColor:
                          meta.ceStatus === "ce_compliant"
                            ? "#dcfce7"
                            : meta.ceStatus === "ante_ce_annex_v"
                            ? "#fef3c7"
                            : "#fee2e2",
                        color:
                          meta.ceStatus === "ce_compliant"
                            ? "#15803d"
                            : meta.ceStatus === "ante_ce_annex_v"
                            ? "#92400e"
                            : "#b91c1c",
                      }}
                    >
                      {meta.ceStatus === "ce_compliant"
                        ? "✅ Marcata CE (Direttiva Macchine)"
                        : meta.ceStatus === "ante_ce_annex_v"
                        ? "⚠️ Ante-CE (All. V D.Lgs. 81/08)"
                        : "❌ Non a Norma (Manca Marcatura CE)"}
                    </span>

                    {/* Libretto Uso e Manutenzione */}
                    <span style={{ fontSize: "12px", color: meta.manualPresent === "yes" ? "#166534" : "#991b1b" }}>
                      📖 Libretto d'Uso: <strong>{meta.manualPresent === "yes" ? "Presente" : "Assente"}</strong>
                    </span>

                    {/* Registro Manutenzioni */}
                    <span style={{ fontSize: "12px", color: meta.maintenanceLogPresent === "yes" ? "#166534" : "#991b1b" }}>
                      🛠️ Registro Controlli: <strong>{meta.maintenanceLogPresent === "yes" ? "Aggiornato" : "Assente / Non tenuto"}</strong>
                    </span>

                    {/* Verifica Periodica INAIL */}
                    {meta.inailCheckRequired && (
                      <span
                        style={{
                          backgroundColor: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          color: "#1e40af",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        🔍 Verifica Periodica INAIL (art. 71 c. 11):{" "}
                        {meta.inailSerial ? `Matr. ${meta.inailSerial}` : "Attiva"}{" "}
                        {meta.inailNextCheckDate ? `(Scad: ${meta.inailNextCheckDate})` : ""}
                      </span>
                    )}
                  </div>

                  {/* BOX FORMAZIONE SPECIFICA OPERATORI (COLLEGAMENTO TAB 5) */}
                  <div
                    style={{
                      backgroundColor: "#f0f9ff",
                      border: "1px solid #bae6fd",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginBottom: 14,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: "16px" }}>🎓</span>
                        <strong style={{ fontSize: "13px", color: "#0369a1" }}>
                          Formazione Specifica Operatori Obbligatoria:
                        </strong>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#0c4a6e" }}>
                          {training.courseTitle}
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#0284c7", marginTop: 2 }}>
                        ⚖️ {training.normReference} — Durata minima: <strong>{training.minHours} ore</strong> (Aggiornamento quinquennale: {training.frequencyYears} anni).
                      </div>
                    </div>

                    <span
                      style={{
                        backgroundColor: "#e0f2fe",
                        color: "#0369a1",
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      🔗 Sincronizzato con Step 5 Formazione
                    </span>
                  </div>

                  {/* CASSETTO REQUISITI DI SICUREZZA SPECIFICI */}
                  <div
                    style={{
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: 12,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                        🔍 Libreria Controlli di Sicurezza Specifici ({checks.length} requisiti):
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        {!isInspectionValidated && (
                          <button
                            type="button"
                            onClick={() => setCustomReqModalMachine(m)}
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "1px solid #cbd5e1",
                              color: "#475569",
                              padding: "4px 10px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            ➕ Aggiungi Requisito Personalizzato
                          </button>
                        )}

                        {onAddCustomItems && !isInspectionValidated && (
                          isIncludedInChecklist ? (
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>
                              ✓ Controlli inclusi nella checklist
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={integratingMachineId === m.id}
                              onClick={async () => {
                                setIntegratingMachineId(m.id);
                                try {
                                  await onAddCustomItems(
                                    checks.map((c) => ({
                                      section: "premises_equipment",
                                      domain: "safety",
                                      area: `Sicurezza Macchine - ${m.name}`,
                                      question: c.question,
                                      normReference: c.normReference,
                                      defaultSeverity: c.defaultSeverity,
                                      defaultSanctionable: c.defaultSanctionable,
                                    })),
                                  );
                                  setActionMessage(`✓ Controlli di sicurezza per "${m.name}" integrati nella checklist del sopralluogo!`);
                                } catch (e) {
                                  setError(e instanceof Error ? e.message : "Errore integrazione requisiti");
                                } finally {
                                  setIntegratingMachineId(null);
                                }
                              }}
                              style={{
                                backgroundColor: "#16a34a",
                                color: "#fff",
                                border: "none",
                                padding: "4px 12px",
                                borderRadius: 4,
                                fontSize: "11px",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              {integratingMachineId === m.id ? "Integrazione..." : "⚡ Includi nella Checklist Sopralluogo"}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 6 }}>
                      {checks.map((chk, cidx) => (
                        <div
                          key={chk.code || cidx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 12,
                            padding: "6px 10px",
                            backgroundColor: "#f8fafc",
                            borderRadius: 6,
                            border: "1px solid #f1f5f9",
                            fontSize: "12px",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <strong>{chk.title}:</strong> {chk.question}
                          </div>
                          <span style={{ color: "#64748b", fontStyle: "italic", whiteSpace: "nowrap", fontSize: "11px" }}>
                            {chk.normReference}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {machines.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  backgroundColor: "#f8fafc",
                  borderRadius: 10,
                  border: "2px dashed #cbd5e1",
                  color: "#64748b",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: 10 }}>🚜</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                  Nessuna macchina censita per questa azienda
                </div>
                <div style={{ fontSize: "13px", marginTop: 6, marginBottom: 16 }}>
                  Precarica le macchine standard previste per il settore {sectorCatalog.sectorLabel} o inseriscile manualmente.
                </div>
                {!isInspectionValidated && (
                  <button
                    type="button"
                    onClick={handlePreloadSectorMachines}
                    style={{
                      backgroundColor: "var(--color-primary, #0f172a)",
                      color: "#fff",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: 6,
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ⚡ Precarica {sectorCatalog.machines.length} Macchine Tipiche del Settore
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCHEDA 2: ATTREZZATURE MINORI                                 */}
      {/* ============================================================== */}
      {tab === "equipment" && (
        <EquipmentTab
          token={token}
          companyId={companyId}
          items={equipment}
          onChanged={reload}
          onError={setError}
          onOpenQr={onOpenQr}
        />
      )}

      {/* ============================================================== */}
      {/* SCHEDA 3: ESTINTORI                                            */}
      {/* ============================================================== */}
      {tab === "extinguishers" && (
        <ExtinguishersTab
          token={token}
          companyId={companyId}
          items={extinguishers}
          onChanged={reload}
          onError={setError}
          onOpenQr={onOpenQr}
        />
      )}

      {/* ============================================================== */}
      {/* SCHEDA 4: CASSETTE PRIMO SOCCORSO                              */}
      {/* ============================================================== */}
      {tab === "firstAid" && (
        <FirstAidTab
          token={token}
          companyId={companyId}
          items={firstAidKits}
          onChanged={reload}
          onError={setError}
          onOpenQr={onOpenQr}
        />
      )}

      {/* ============================================================== */}
      {/* MODALE INSERIMENTO / MODIFICA MACCHINA CON DATI MINIMI         */}
      {/* ============================================================== */}
      {showMachineModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>
                {editingMachine ? `✏️ Modifica Macchina: ${editingMachine.name}` : "➕ Nuovo Censimento Macchina / Attrezzatura"}
              </h3>
              <button
                type="button"
                onClick={() => setShowMachineModal(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMachine} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Dati Minimi: Nome e Tipo */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Nome Macchinario *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Es. Affettatrice professionale, Carrello elevatore"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Categoria / Tipo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Es. Macchina Lavorazione Carni, Sollevamento"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
              </div>

              {/* Dati Minimi: Costruttore, Modello, Matricola, Anno */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Costruttore / Marca
                  </label>
                  <input
                    type="text"
                    placeholder="Es. Berkel, Toyota"
                    value={formManufacturer}
                    onChange={(e) => setFormManufacturer(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Modello
                  </label>
                  <input
                    type="text"
                    placeholder="Es. V350, Traigo 48"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Numero Matricola
                  </label>
                  <input
                    type="text"
                    placeholder="Es. SN-948201"
                    value={formSerialNumber}
                    onChange={(e) => setFormSerialNumber(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Anno Fabbricazione
                  </label>
                  <input
                    type="number"
                    min={1960}
                    max={new Date().getFullYear() + 1}
                    value={formBuildYear ?? ""}
                    onChange={(e) => setFormBuildYear(e.target.value ? Number(e.target.value) : undefined)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
              </div>

              {/* Marcatura CE e Documenti di Bordo */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Marcatura CE (Direttiva Macchine)
                  </label>
                  <select
                    value={formCeStatus}
                    onChange={(e) => setFormCeStatus(e.target.value as any)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  >
                    <option value="ce_compliant">✅ Marcata CE (con Dichiarazione CE)</option>
                    <option value="ante_ce_annex_v">⚠️ Ante-CE (All. V D.Lgs. 81/08)</option>
                    <option value="non_compliant">❌ Non Conforme (Senza Marcatura)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Manuale d'Uso e Manutenzione
                  </label>
                  <select
                    value={formManualPresent}
                    onChange={(e) => setFormManualPresent(e.target.value as any)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  >
                    <option value="yes">✅ Presente in lingua italiana</option>
                    <option value="no">❌ Assente / Non reperibile</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Registro Controlli e Manutenzioni
                  </label>
                  <select
                    value={formMaintenanceLogPresent}
                    onChange={(e) => setFormMaintenanceLogPresent(e.target.value as any)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  >
                    <option value="yes">✅ Compilato e aggiornato</option>
                    <option value="expired">⚠️ Non aggiornato</option>
                    <option value="no">❌ Assente</option>
                  </select>
                </div>
              </div>

              {/* Verifica Periodica Obbligatoria ex art. 71 c. 11 (INAIL / ARPA) */}
              <div
                style={{
                  backgroundColor: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: 8,
                  padding: "12px",
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", fontWeight: 700, color: "#0369a1", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formInailCheckRequired}
                    onChange={(e) => setFormInailCheckRequired(e.target.checked)}
                  />
                  <span>Attrezzatura soggetta a Verifica Periodica Obbligatoria (D.Lgs. 81/08 art. 71 c. 11 / D.M. 11/04/2011)</span>
                </label>

                {formInailCheckRequired && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#0c4a6e", marginBottom: 4 }}>
                        Matricola INAIL / Codice Impianto
                      </label>
                      <input
                        type="text"
                        placeholder="Es. INAIL-49821"
                        value={formInailSerial}
                        onChange={(e) => setFormInailSerial(e.target.value)}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #93c5fd", fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#0c4a6e", marginBottom: 4 }}>
                        Data Ultima Verifica
                      </label>
                      <input
                        type="date"
                        value={formInailLastCheckDate}
                        onChange={(e) => setFormInailLastCheckDate(e.target.value)}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #93c5fd", fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#0c4a6e", marginBottom: 4 }}>
                        Data Prossima Verifica / Scadenza *
                      </label>
                      <input
                        type="date"
                        value={formInailNextCheckDate}
                        onChange={(e) => setFormInailNextCheckDate(e.target.value)}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #93c5fd", fontSize: "12px" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Ubicazione */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Ubicazione / Reparto di Installazione
                </label>
                <input
                  type="text"
                  placeholder="Es. Cucina piano terra, Magazzino corsia B, Officina"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowMachineModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#fff",
                    color: "#334155",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "var(--color-primary, #0f172a)",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {formSubmitting ? "Salvataggio..." : "Salva Macchinario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE AGGIUNGI REQUISITO PERSONALIZZATO SULLA MACCHINA */}
      {customReqModalMachine && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>
                ➕ Aggiungi Requisito di Sicurezza: {customReqModalMachine.name}
              </h3>
              <button
                type="button"
                onClick={() => setCustomReqModalMachine(null)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomRequirementToMachine} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Domanda / Verifica di Conformità Specificata *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Es. Il carter della catena di trasmissione presenta microinterruttore di sicurezza efficiente?"
                  value={customReqQuestion}
                  onChange={(e) => setCustomReqQuestion(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px", fontFamily: "inherit" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Riferimento Normativo (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es. D.Lgs. 81/2008 Allegato V punto 6"
                  value={customReqNorm}
                  onChange={(e) => setCustomReqNorm(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>Gravità:</span>
                  <select
                    value={customReqSeverity}
                    onChange={(e) => setCustomReqSeverity(Number(e.target.value))}
                    style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "12px" }}
                  >
                    <option value={1}>1 - Lieve</option>
                    <option value={2}>2 - Media</option>
                    <option value={3}>3 - Grave</option>
                    <option value={4}>4 - Critica</option>
                  </select>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={customReqSanctionable}
                    onChange={(e) => setCustomReqSanctionable(e.target.checked)}
                  />
                  <span>Sanzionabile se carente</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setCustomReqModalMachine(null)}
                  style={{ padding: "7px 14px", borderRadius: 6, border: "1px solid #cbd5e1", backgroundColor: "#fff", cursor: "pointer", fontSize: "13px" }}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  style={{ padding: "7px 16px", borderRadius: 6, border: "none", backgroundColor: "var(--color-primary, #0f172a)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
                >
                  Aggiungi Requisito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
